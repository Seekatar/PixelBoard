#define USE_OLED

#include "ILogMsg.h"

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


void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
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

void loop() {
  // listen for incoming clients
  WiFiClient client = server.available();
  char c;
  if (client) {
    char *content_length = NULL;
    logger.LogMsg(ILogMsg::LogLevel::Debug, "new client");

    // an http request ends with a blank line
    boolean currentLineIsBlank = true;
    int headerLen = 0;
    int len = 0;
    
    while (client.connected()) {
      if (client.available()) {
        c = client.read();

        if (c == '\n' && currentLineIsBlank) {
            logger.LogMsg( ILogMsg::LogLevel::Verbose, "Got first blank, reading payload!");
            int count = 0;
            while ( count < len )
            {
              while ( client.available() )
              {
                _buffer[count++] = client.read();
              }
            }
            _buffer[count] = '\0';

            logger.LogMsg(ILogMsg::LogLevel::Debug, "Payload count is %d", count);
            logger.LogMsg(ILogMsg::LogLevel::Debug,_buffer);

            break;
        }
        
        if (c == '\n') {
          _headerLine[headerLen] = '\0';
          logger.LogMsg(ILogMsg::LogLevel::Verbose, "HEADER: %s", _headerLine);
          
          currentLineIsBlank = true;
          headerLen = 0;
          if ( strncmp(_headerLine, "Content-Length: ", strlen("Content-Length: ")) == 0 )
          {
            len = atoi(_headerLine+strlen("Content-Length: "));
            logger.LogMsg(ILogMsg::LogLevel::Verbose, "Len is %d", len);
          }
        } else if (c != '\r') {
          // you've gotten a character on the current line
          currentLineIsBlank = false;
          if ( headerLen < HEADER_LEN )
            _headerLine[headerLen++] = c;
        }
     
      } // end available
    }
    
    sendResponse(client, processPayload(_buffer));

    // close the connection:
    client.stop();
    logger.LogMsg(ILogMsg::LogLevel::Debug, "client disonnected");
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

