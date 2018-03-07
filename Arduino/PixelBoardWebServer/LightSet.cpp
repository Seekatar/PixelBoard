#include "LightSet.h"

bool LightSet::Initialize()
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
