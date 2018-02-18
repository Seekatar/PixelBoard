
#include <Adafruit_NeoPixel.h>

class LightSet
{
  Adafruit_NeoPixel *_strip;
  void (*logMsg)(const char *, ...);

  static const int DATA_PIN = 6;
  static const int PIXEL_COUNT = 30;
  
public:
  virtual bool initialize();

  LightSet(void (*logMsg)(const char *,...)) :  logMsg( logMsg )
  {
    _strip = new Adafruit_NeoPixel(PIXEL_COUNT, DATA_PIN, NEO_RGB + NEO_KHZ800);
  }

  void SetLight( int lightId, uint32_t color );
  void ShowLights();
};
