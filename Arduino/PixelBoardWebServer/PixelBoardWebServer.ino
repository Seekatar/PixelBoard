/*
  WiFi Web Server

 A simple web server that shows the value of the analog input pins.
 using a WiFi shield.

 This example is written for a network using WPA encryption. For
 WEP or WPA, change the Wifi.begin() call accordingly.

 Circuit:
 * WiFi shield attached
 * Analog inputs attached to pins A0 through A5 (optional)

 created 13 July 2010
 by dlf (Metodo2 srl)
 modified 31 May 2012
 by Tom Igoe

 */
#define USE_OLED

#include <stdarg.h>

bool displayOk = false;
char logMsgBuffer[300];
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

#ifdef USE_OLED
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_RESET 4
Adafruit_SSD1306 display(OLED_RESET);
#if (SSD1306_LCDHEIGHT != 32)
  #error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif

// On 32u4 or M0 Feathers, buttons A, B & C connect to 9, 6, 5 respectively
const int buttonA = 9;
const int buttonB = 6;
const int buttonC = 5;

void initDisplay()
{
  Serial.println("Starting display");

  // display init
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C, true); // initialize with the I2C addr 0x3C (for the 128x32)
  display.display();

  // initialize the button pin as a input:
  pinMode(buttonA, INPUT_PULLUP);
  pinMode(buttonB, INPUT_PULLUP);
  pinMode(buttonC, INPUT_PULLUP);

  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.println("Display ok");
  display.display();

  displayOk = true;
}

// 4, 21 char lines on display
char logArray[4][22];
int topLine = 0;
const int LINE_LEN = 21;


void logLine( const char *msg )
{
  //  try
  {
    if (displayOk)
    {
      display.clearDisplay();
      display.setCursor(0, 0);
      display.setTextColor(WHITE);
      display.setTextSize(1);

      strncpy( logArray[topLine], msg, LINE_LEN );

      if ( ++topLine > 3 )
        topLine = 0;

      int j = 0;
      for ( int i = topLine; i < 4; i++ )
        display.println(logArray[i]);
      for ( int i = 0; i < topLine; i++)
        display.println(logArray[i]);

      display.display();
    }
  }
  //  catch ( ... )
  //  {
  //    Serial.println("Exception using display.  Turning it off");
  //    displayOk = false;
  //  }
}
#else
void initDisplay() {}
void logLine( const char *msg ) {}
#endif

void logMsg(const char *msg, ...)
{
  va_list args;
  va_start( args, msg );
  vsnprintf( logMsgBuffer, 300, msg, args );

  Serial.println(logMsgBuffer);

  #ifdef USE_OLED
  char *s = strtok( logMsgBuffer, "\r\n" );
  while ( s != NULL )
  {
    char *t = s;
    while ( strlen( t ) > LINE_LEN )
    {
      char line[22];
      strncpy( line, t, LINE_LEN );
      line[21] = '\0';
      logLine( line );
      t += LINE_LEN;
    }
    if ( strlen(t) > 0 )
      logLine(t);
    s = strtok( NULL, "\r\n");
  }
  #endif

  va_end(args);
}

#include "my_keys.h"
int keyIndex = 0;                 // your network key Index number (needed only for WEP)

int status = WL_IDLE_STATUS;

#include <ArduinoJson.h>
#include "LightSet.h"
WiFiServer server(80);
LightSet lightSet(logMsg);


void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("Serial started");
  initDisplay();

#ifdef ARDUINO_SAMD_FEATHER_M0
  //Configure pins for Adafruit ATWINC1500 Feather
  WiFi.setPins(8, 7, 4, 2);
#endif

  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    logMsg("WiFi shield not present");
    // don't continue:
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv != "1.1.0") {
    logMsg("Please upgrade the firmware");
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    logMsg("Attempting to connect to SSID: %s",ssid);
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

void processPayload(const char *output)
{
  // from https://arduinojson.org/assistant/
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
        logMsg( "Channel %d %x", channel.get<int>("circuit"), channel.get<uint32_t>("value"));
        lightSet.SetLight(channel.get<int>("circuit"), channel.get<uint32_t>("value") );
      }
      lightSet.ShowLights();
    }
  }

}

void sendResponse( WiFiClient &client)
{
    // send a standard http response header
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("Connection: close");  // the connection will be closed after completion of the response
    client.println("Refresh: 5");  // refresh the page automatically every 5 sec
    client.println();
    client.println("{\"data\": [");
    // output the value of each analog input pin
    for (int analogChannel = 0; analogChannel < 6; analogChannel++) {
      int sensorReading = analogRead(analogChannel);
      client.print("{\"analog_");
      client.print(analogChannel);
      client.print(+"\": ");
      client.print(sensorReading);
      if ( analogChannel < 5 )
        client.println("},");
      else
        client.println("}");
    }
    client.println("]}");

    // give the web browser time to receive the data
    delay(1);
}
void loop() {
  // listen for incoming clients
  WiFiClient client = server.available();
  char c;
  if (client) {
    char *content_length = NULL;
    Serial.println("new client");
    // an http request ends with a blank line
    boolean currentLineIsBlank = true;
    while (client.connected()) {
      if (client.available()) {
        c = client.read();
        Serial.write(c);

        // if you've gotten to the end of the line (received a newline
        // character) and the line is blank, the http request has ended,
        // so you can send a reply
        if (c == '\n' && currentLineIsBlank) {
            logMsg("Got first blank, reading payload!");
            int count = 0;
            while ( client.available() )
            {
              _buffer[count++] = client.read();
            }
            _buffer[count] = '\0';
            Serial.print("Payload count is ");
            Serial.println(count);
            Serial.println(_buffer);
            break;
        }
        if (c == '\n') {
          // you're starting a new line
          currentLineIsBlank = true;
        } else if (c != '\r') {
          // you've gotten a character on the current line
          currentLineIsBlank = false;
        }
      } // end available
    }
    Serial.println("");

    processPayload(_buffer);

    sendResponse(client);

    // close the connection:
    client.stop();
    Serial.println("client disonnected");
  }
}


void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  logMsg("IP: %d.%d.%d.%d", ip[0],ip[1],ip[2],ip[3]);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  logMsg("sig str: %ddBM", rssi);
}

