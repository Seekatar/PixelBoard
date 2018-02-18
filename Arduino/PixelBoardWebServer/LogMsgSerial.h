#ifndef __LOGMSGSERIAL_H__
#define __LOGMSGSERIAL_H__
#include "ILogMsg.h"

// log message to serial only
class LogMsgSerial : public ILogMsg
{
public:
  virtual bool Initialize() { return true; }
  virtual void LogMsg(ILogMsg::LogLevel level, const char *msg, ...);
  virtual void SetLogLevel(ILogMsg::LogLevel level ) { logLevel = level; }

protected:
  virtual void logMsg(char *msg);
  ILogMsg::LogLevel logLevel = ILogMsg::LogLevel::Info;
  char logMsgBuffer[300];
};

#endif