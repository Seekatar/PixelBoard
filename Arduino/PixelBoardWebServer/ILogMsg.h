#ifndef __ILOGMSG_H__
#define __ILOGMSG_H__

#include <stdarg.h>

class ILogMsg
{
public:
  enum LogLevel {
    Debug,
    Verbose,
    Info,
    Warn,
    Error
  };
  static ILogMsg& Instance();

  virtual bool Initialize() = 0;
  virtual void LogMsg(LogLevel level, const char *msg, ...) = 0;
  virtual void SetLogLevel(LogLevel level ) = 0;
};

#endif