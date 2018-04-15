#include "LogMsgWithOled.h"

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_RESET 4
Adafruit_SSD1306 display(OLED_RESET);
#if (SSD1306_LCDHEIGHT != 32)
#error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif

bool LogMsgWithOled::Initialize()
{
  if (LogMsgSerial::Initialize())
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
    return displayOk;
  }
}

void LogMsgWithOled::logLine(const char *msg)
{
  if (displayOk)
  {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.setTextColor(WHITE);
    display.setTextSize(1);

    strncpy(logArray[topLine], msg, LINE_LEN);
    logArray[topLine][LINE_LEN] = '\0';

    if (++topLine > 3)
      topLine = 0;

    int j = 0;
    for (int i = topLine; i < 4; i++)
      display.println(logArray[i]);
    for (int i = 0; i < topLine; i++)
      display.println(logArray[i]);

    display.display();
  }
}

void LogMsgWithOled::logMsg(char *msg, LogLevel level)
{
  LogMsgSerial::logMsg(msg, level);
  
  if (level <= LogLevel::Debug || msg == NULL)
    return; // can't send lots of data to 3-line screen!

  char *s = strtok(msg, "\r\n");
  while (s != NULL)
  {
    char *t = s;
    while (strlen(t) > LINE_LEN)
    {
      char line[LINE_LEN+1];
      strncpy(line, t, LINE_LEN);
      line[LINE_LEN] = '\0';
      logLine(line);
      t += LINE_LEN;
    }
    if (strlen(t) > 0)
    {
      logLine(t);
    }
    s = strtok(NULL, "\r\n");
  }
}
