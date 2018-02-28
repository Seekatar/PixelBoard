
#include <Adafruit_NeoPixel.h>
#include "ILogMsg.h"

class LightSet
{
  Adafruit_NeoPixel *_strip;
  ILogMsg &logMsg;

  static const int DATA_PIN = 6;
  static const int PIXEL_COUNT = 30;

public:
  virtual bool initialize();

  LightSet(ILogMsg &logMsg) :  logMsg( logMsg )
  {
    _strip = new Adafruit_NeoPixel(PIXEL_COUNT, DATA_PIN, NEO_RGB + NEO_KHZ800);
  }

  void SetLight( int lightId, uint32_t color );
  void ShowLights();
};
