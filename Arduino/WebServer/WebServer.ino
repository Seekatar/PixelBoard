#define USE_OLED

#include "ILogMsg.h"
#include <ArduinoHttpServer.h>
#define getErrorDescription getErrorDescrition
#define DEBUG

#ifdef ARDUINO_SAMD_FEATHER_M0
const int STATUS_LED = 13;
#elif defined(ESP_PLATFORM)
const int STATUS_LED = 5;
#else
const int STATUS_LED = 14;
#endif

#ifdef ARDUINO_SAMD_FEATHER_M0
  #define CONF_WINC_DEBUG 1
  #include <SPI.h>
  #include <WiFi101.h>
#elif defined(ESP_PLATFORM) // SparkFun ESP32 Thing
  #include <WiFi.h>
#else
  #include <ESP8266WiFi.h>
#endif

#include "my_keys.h"
int keyIndex = 0;                 // your network key Index number (needed only for WEP)

int status = WL_IDLE_STATUS;

#include <ArduinoJson.h>

#include "LightSet.h"
WiFiServer server(80);
ILogMsg &logger = ILogMsg::Instance();
//logger.SetLogLevel(ILogMsg::LogLevel::Debug);
LightSet lightSet(logger);

void printWifiStatus();

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  #ifdef DEBUG
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  #endif
  Serial.println("Serial started");
  logger.Initialize();

#ifdef ARDUINO_SAMD_FEATHER_M0
  //Configure pins for Adafruit ATWINC1500 Feather
  WiFi.setPins(8, 7, 4, 2);
#endif

  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    logger.LogMsg( ILogMsg::LogLevel::Info, "WiFi shield not present");
    // don't continue:
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv != "1.1.0") {
    logger.LogMsg( ILogMsg::LogLevel::Info, "Please upgrade the firmware");
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    logger.LogMsg( ILogMsg::LogLevel::Info, "Attempting to connect to SSID: %s",ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(1000);
  }
  lightSet.initialize();

  server.begin();
  // you're connected now, so print out the status:
  printWifiStatus();
}

const static int BUFFER_LEN = 5000;
char _buffer[BUFFER_LEN];
const static int HEADER_LEN = 200;
char _headerLine[HEADER_LEN+1];

bool processPayload(const char *output)
{
  // from https://arduinojson.org/assistant/
  #define ARRAY_SIZE 30
  // const size_t bufferSize = JSON_ARRAY_SIZE(ARRAY_SIZE) + JSON_OBJECT_SIZE(1) + ARRAY_SIZE*JSON_OBJECT_SIZE(2) + 700;
  const size_t bufferSize = JSON_ARRAY_SIZE(10) + JSON_OBJECT_SIZE(1) + 10*JSON_OBJECT_SIZE(2) + 219;
  DynamicJsonBuffer jsonBuffer(bufferSize);

  output = strchr( output, '{' );
  if ( output != NULL )
  {
    JsonObject& root = jsonBuffer.parseObject(output);
    if ( root.success() )
    {
      JsonArray &channels = root["channels"];
      for ( int i = 0; i < channels.size(); i++ )
      {
        JsonObject &channel = channels[i];
        logger.LogMsg( ILogMsg::LogLevel::Info,  "Channel %d %x", channel.get<int>("circuit"), channel.get<uint32_t>("value"));
        lightSet.SetLight(channel.get<int>("circuit"), channel.get<uint32_t>("value") );
      }
      lightSet.ShowLights();
      return true;
    }
    else
    {
      Serial.println( "Error parsing JSON" );
      Serial.println( output );
      logger.LogMsg( ILogMsg::LogLevel::Error, "Error parsing JSON" );
      logger.LogMsg( ILogMsg::LogLevel::Debug, output );
    }
  }
  else
  {
    Serial.println( "Open brace missing in payload" );
    Serial.println( output );
    logger.LogMsg( ILogMsg::LogLevel::Error, "Open brace missing in payload" );
    logger.LogMsg( ILogMsg::LogLevel::Debug, output );
  }
  return false;
}

void sendResponse( WiFiClient &client, bool ok )
{
    // send a standard http response header
    if ( ok )
      client.println("HTTP/1.1 200 OK");
    else
      client.println("HTTP/1.1 400 INVALID_REQUEST");
    client.println("Content-Type: application/json");
    client.println("Connection: close");  // the connection will be closed after completion of the response
    client.println("Refresh: 5");  // refresh the page automatically every 5 sec
    client.println();
    client.println("{\"status\": \"OK\"}");
    // give the web browser time to receive the data
    // delay(1);
}

void loop() 
{
  // listen for incoming clients
  WiFiClient client = server.available();
  char c;
  if (client) 
  {
    char *content_length = NULL;
    logger.LogMsg(ILogMsg::LogLevel::Debug, "new client");

    // an http request ends with a blank line
    boolean currentLineIsBlank = true;
    int headerLen = 0;
    int len = 0;
    
    if (client.connected()) 
    {
      Serial.println("Client connected");
      // Connected to client. Allocate and initialize StreamHttpRequest object.
      ArduinoHttpServer::StreamHttpRequest<1023> httpRequest(client);

      // Parse the request.
      if (httpRequest.readRequest())
      {
         // Retrieve HTTP resource / URL requested
         Serial.print("resource requested ");
         Serial.println( httpRequest.getResource().toString() );

         // Retrieve HTTP method.
         ArduinoHttpServer::MethodEnum method( ArduinoHttpServer::MethodInvalid );
         method = httpRequest.getMethod();
        if( method == ArduinoHttpServer::MethodPost )
         {
           Serial.println( "Got PUT" );
           // sendResponse(client, processPayload( httpRequest.getBody() ));
           ArduinoHttpServer::StreamHttpErrorReply httpReply(client, "application/json");
           httpReply.send("{\"status\": \"OK\"}");
           logger.LogMsg(ILogMsg::LogLevel::Debug, "client disonnected");
         }
         else
         {
           Serial.print( "Got unsupported method  ");
           Serial.println(method);
           sendResponse(client, false );
           ArduinoHttpServer::StreamHttpErrorReply httpReply(client, "application/json", "400");
           httpReply.send("Unsupported method");
         }
      }
      else
      {
         // HTTP parsing failed. Client did not provide correct HTTP data or
         // client requested an unsupported feature.
         ArduinoHttpServer::StreamHttpErrorReply httpReply(client, httpRequest.getContentType());
         httpReply.send(httpRequest.getErrorDescrition());
      }
      client.stop();
    }
  }
}


void printWifiStatus() {
  // print the SSID of the network you're attached to:
  // Serial.print("SSID: ");
  // Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  logger.LogMsg( ILogMsg::LogLevel::Info, "IP: %d.%d.%d.%d", ip[0],ip[1],ip[2],ip[3]);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  logger.LogMsg( ILogMsg::LogLevel::Info, "sig str: %ddBM", rssi);
}

