#include <ArduinoHttpServer.h>
// 'fix' missing in HttpServer
#define getErrorDescription getErrorDescrition

#ifdef ARDUINO_SAMD_FEATHER_M0
const int STATUS_LED = 13;
const int dataPin = 6;
#define CONF_WINC_DEBUG 1
#include <SPI.h>
#include <WiFi101.h>
#elif defined(ESP_PLATFORM) // SparkFun ESP32 Thing
const int STATUS_LED = 5;
const int dataPin = 12;
#include <WiFi.h>
#else
const int STATUS_LED = 14;
const int dataPin = 12;
#include <ESP8266WiFi.h>
#endif

#include "ILogMsg.h"
#include "my_keys.h"
#include <ArduinoJson.h>
#include "LightSet.h"
#include "Model.h"

WiFiServer server(80);
ILogMsg &logger = ILogMsg::Instance();
//logger.SetLogLevel(ILogMsg::LogLevel::Debug);

const int ARRAY_SIZE = 30;
ILightSet *lightSet = new LightSet(logger, dataPin, ARRAY_SIZE);
Scene scene(ARRAY_SIZE);

void setup()
{
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  Serial.println("Serial started");
  logger.Initialize();

#ifdef ARDUINO_SAMD_FEATHER_M0
  //Configure pins for Adafruit ATWINC1500 Feather
  WiFi.setPins(8, 7, 4, 2);
#endif

  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD)
  {
    logger.LogMsg(ILogMsg::LogLevel::Info, "WiFi shield not present");
    // don't continue:
    while (true)
      ;
  }

  // attempt to connect to Wifi network:
  /*typedef enum {
    WL_NO_SHIELD        = 255,   // for compatibility with WiFi Shield library
    WL_IDLE_STATUS      = 0,
    WL_NO_SSID_AVAIL    = 1,
    WL_SCAN_COMPLETED   = 2,
    WL_CONNECTED        = 3,
    WL_CONNECT_FAILED   = 4,
    WL_CONNECTION_LOST  = 5,
    WL_DISCONNECTED     = 6
  } wl_status_t;*/

  int status = WL_IDLE_STATUS;

  while (status != WL_CONNECTED)
  {
    logger.LogMsg(ILogMsg::LogLevel::Info, "Attempting to connect to SSID: %s Status = %d", ssid, status);
    status = WiFi.begin(ssid, pass);

    // wait for connection:
    delay(3000);
  }
  lightSet->Initialize();

  server.begin();

  printWifiStatus();
}

const static int BUFFER_LEN = 5000;
char _buffer[BUFFER_LEN];
const static int HEADER_LEN = 200;
char _headerLine[HEADER_LEN + 1];

bool processPayload(const char *output)
{
  // from https://arduinojson.org/assistant/
  // const size_t bufferSize = JSON_ARRAY_SIZE(ARRAY_SIZE) + JSON_OBJECT_SIZE(1) + ARRAY_SIZE*JSON_OBJECT_SIZE(2) + 700;
  const size_t bufferSize = JSON_ARRAY_SIZE(10) + JSON_OBJECT_SIZE(1) + 10 * JSON_OBJECT_SIZE(2) + 219;
  DynamicJsonBuffer jsonBuffer(bufferSize);

  output = strchr(output, '{');
  if (output != NULL)
  {
    JsonObject &root = jsonBuffer.parseObject(output);
    if (root.success())
    {
      String transition = root["transition"];
      JsonArray &channels = root["channels"];
      for (int i = 0; i < channels.size(); i++)
      {
        JsonObject &channel = channels[i];
        int id = channel.get<int>("circuit");
        if (id < scene.Count())
          scene[id]->Color = channel.get<uint32_t>("value");
        logger.LogMsg(ILogMsg::LogLevel::Info, "Channel %d 0X%06X", scene[id]->Id, scene[id]->Color);
      }

      for (int i = 0; i < scene.Count(); i++)
        lightSet->SetLight(scene[i]->Id, scene[i]->Color);

      lightSet->ShowLights(transition);
      return true;
    }
    else
    {
      Serial.println("Error parsing JSON");
      Serial.println(output);
      logger.LogMsg(ILogMsg::LogLevel::Error, "Error parsing JSON");
      logger.LogMsg(ILogMsg::LogLevel::Debug, output);
    }
  }
  else
  {
    Serial.println("Open brace missing in payload");
    Serial.println(output);
    logger.LogMsg(ILogMsg::LogLevel::Error, "Open brace missing in payload");
    logger.LogMsg(ILogMsg::LogLevel::Debug, output);
  }
  return false;
}

void sendResponse(WiFiClient &client, bool ok)
{
  Serial.print("sending response since ok is ");
  Serial.println(ok);
  if (ok)
  {
    ArduinoHttpServer::StreamHttpReply httpReply(client, "application/json");
    httpReply.send("{\"status\": \"OK\" }");
  }
  else
  {
    ArduinoHttpServer::StreamHttpErrorReply httpReply(client, "application/json");
    httpReply.send("{\"status\": \"ERROR\" }");
  }
}

void loop()
{
  // listen for incoming clients
  WiFiClient client = server.available();
  char c;
  if (client.connected())
  {
    logger.LogMsg(ILogMsg::LogLevel::Debug, "new client");

    // Connected to client. Allocate and initialize StreamHttpRequest object.
    ArduinoHttpServer::StreamHttpRequest<1023> httpRequest(client);

    // Parse the request.
    if (httpRequest.readRequest())
    {
      // GET api/pixel
      // POST api/pixel
      if (httpRequest.getResource()[0] == "api" && httpRequest.getResource()[1] == "pixel")
      {
        Serial.println(httpRequest.getResource()[2]);

        ArduinoHttpServer::MethodEnum method(ArduinoHttpServer::MethodInvalid);
        method = httpRequest.getMethod();

        if (method == ArduinoHttpServer::MethodGet)
        {
          ArduinoHttpServer::StreamHttpReply httpReply(client, "application/json");
          StaticJsonBuffer<1000> jsonBuffer;
          JsonObject &root = jsonBuffer.createObject();
          root["status"] = "OK";
          JsonArray &lights = root.createNestedArray("channels");
          for (int i = 0; i < scene.Count(); i++)
          {
            JsonObject &light = lights.createNestedObject();
            light["channel"] = scene[i]->Id;
            light["value"] = scene[i]->Color;
          }
          String s;
          root.printTo(s);
          httpReply.send(s);
        }
        else if (method == ArduinoHttpServer::MethodPost)
        {
          bool ret = processPayload(httpRequest.getBody());
          sendResponse(client, ret);
        }
      }
      else
      {
        ArduinoHttpServer::StreamHttpErrorReply httpReply(client, httpRequest.getContentType(), "404");
        httpReply.send("{\"status\":\"ERROR\" }");
      }
    }
    else
    {
      // HTTP parsing failed. Client did not provide correct HTTP data or
      // client requested an unsupported feature.
      ArduinoHttpServer::StreamHttpErrorReply httpReply(client, httpRequest.getContentType());
      httpReply.send(httpRequest.getErrorDescription());
    }

    // close the connection:
    client.stop();
    logger.LogMsg(ILogMsg::LogLevel::Debug, "client disonnected");
  }
}

void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  // Serial.print("SSID: ");
  // Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  logger.LogMsg(ILogMsg::LogLevel::Info, "IP: %d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3]);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  logger.LogMsg(ILogMsg::LogLevel::Info, "sig str: %ddBM", rssi);
}
