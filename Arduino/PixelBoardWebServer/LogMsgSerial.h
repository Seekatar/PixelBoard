#ifndef __LOGMSGSERIAL_H__
#define __LOGMSGSERIAL_H__
#include "ILogMsg.h"

// log message to serial only
class LogMsgSerial : public ILogMsg
{
public:
  LogMsgSerial() {}
  virtual bool Initialize() { return true; }
  virtual void LogMsg(ILogMsg::LogLevel level, const char *msg, ...);
  virtual void SetLogLevel(ILogMsg::LogLevel level ) { logLevel = level; }

protected:
  virtual void logMsg(char *msg, LogLevel level);
  ILogMsg::LogLevel logLevel = ILogMsg::LogLevel::Debug;
  char logMsgBuffer[300];
};

#endif
