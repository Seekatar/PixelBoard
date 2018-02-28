#ifndef __LOGMSGWITHOLED_H__
#define __LOGMSGWITHOLED_H__

#define USE_OLED

#include "LogMsgSerial.h"

// log non-debug message to serial, others to OLED
class LogMsgWithOled : public LogMsgSerial
{
public:
  LogMsgWithOled() {}
  virtual bool Initialize();

  // On 32u4 or M0 Feathers, buttons A, B & C connect to 9, 6, 5 respectively
  const int buttonA = 9;
  const int buttonB = 6;
  const int buttonC = 5;

private:
  virtual void logMsg(char *msg, LogLevel level );
  void logLine( const char *msg );

  // 4x21 char lines on display
  const static int LINE_LEN = 21;
  char logArray[4][LINE_LEN+1];
  int topLine = 0;

  void initDisplay();
  bool displayOk = false;
};

#endif
