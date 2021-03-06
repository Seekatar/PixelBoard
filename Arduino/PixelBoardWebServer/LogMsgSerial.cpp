#include "LogMsgSerial.h"
#include <stdio.h>
#include<Arduino.h> // for Serial

void LogMsgSerial::LogMsg(ILogMsg::LogLevel level, const char *msg, ...)
{
  if ( level >= logLevel )
  {
    va_list args;
    va_start( args, msg );
    vsnprintf( logMsgBuffer, 300, msg, args );
    va_end(args);

    logMsg(logMsgBuffer, level);
  }
}

void LogMsgSerial::logMsg(char *msg, LogLevel level)
{
  Serial.println(msg);
}

#ifdef ARDUINO_SAMD_FEATHER_M0
#define USE_OLED
#endif

#ifdef USE_OLED
#include "LogMsgWithOled.h"
ILogMsg& ILogMsg::Instance()
{
  return *(new LogMsgWithOled());
}
#else
ILogMsg& ILogMsg::Instance()
{
  return *(new LogMsgSerial());
}
#endif
