#include "LightSet.h"

bool LightSet::initialize()
{
  _strip->begin();
  _strip->show();
  _strip->setBrightness(255);

  return true;
}

void LightSet::ShowLights()
{
  _strip->show();
}

void LightSet::SetLight( int lightId, uint32_t color )
{
  _strip->setPixelColor(lightId, color);
}
