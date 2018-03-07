#ifndef __LIGHTSET_H__
#define __LIGHTSET_H__

#include <Adafruit_NeoPixel.h>
#include "ILogMsg.h"
#include "ILightSet.h"

class LightSet : public ILightSet
{
  Adafruit_NeoPixel *_strip;
  ILogMsg &logMsg;

  int _dataPin = 6;
  int _pixelCount = 30;

public:
  virtual bool Initialize();

  LightSet(ILogMsg &logMsg, int dataPin = 6, int pixelCount = 30) : logMsg( logMsg )
  {
    _dataPin = dataPin;
    _pixelCount = pixelCount;
    _strip = new Adafruit_NeoPixel(_pixelCount, _dataPin, NEO_RGB + NEO_KHZ800);
  }

  virtual void SetLight( int lightId, uint32_t color );
  virtual void ShowLights();
};

#endif