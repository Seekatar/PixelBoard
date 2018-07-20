#ifndef __LIGHTSET_H__
#define __LIGHTSET_H__

#include <Adafruit_NeoPixel.h>
#include "ILogMsg.h"
#include "ILightSet.h"
#include "Model.h"

class Transition
{
public:
  float  r;
  float  g;
  float  b;
};

class LightSet : public ILightSet
{
  Adafruit_NeoPixel *_strip;
  ILogMsg &logMsg;

  int _dataPin = 6;
  int _pixelCount = 30;

	Light *_current;
	Light *_target;
	PrecisionColor *_transitionColor;

public:
  virtual bool Initialize();

  LightSet(ILogMsg &logMsg, int dataPin = 6, int pixelCount = 30) : logMsg( logMsg )
  {
    _dataPin = dataPin;
    _pixelCount = pixelCount;
    _strip = new Adafruit_NeoPixel(_pixelCount, _dataPin, NEO_RGB + NEO_KHZ800);
		_transitionColor = new PrecisionColor[pixelCount];
		_current = new Light[pixelCount];
		_target = new Light[pixelCount];
  }

  virtual void SetLight( int lightId, uint32_t color );
  virtual void ShowLights(String transition = "3sec");
};

#endif