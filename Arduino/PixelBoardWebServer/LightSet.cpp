#include "LightSet.h"

bool LightSet::Initialize()
{
  _strip->begin();
  _strip->show();
  _strip->setBrightness(255);

  return true;
}

const int steps = 0x100;
void LightSet::ShowLights(String transition)
{
  int ms = 3000;
  if ( transition.endsWith("secs") )
    ms = 1000*atoi(transition.c_str());
  
  int sleep = ms / steps;
  if ( ms == 0 )
  {
    for ( int j = 0; j < _pixelCount; j++ )
    {
      _strip->setPixelColor(j, _target[j].Color);
    }
    _strip->show();
  }
  else
  {
    for ( int i = 0; i < steps; i++ )
    {
      for ( int j = 0; j < _pixelCount; j++ )
      {
			  _current[j].CurrentColor += _transitionColor[j];
        _strip->setPixelColor(j, _current[j].CurrentColor.ToColor());
      }
      _strip->show();

      delay(sleep);
    }
  }

  for ( int j = 0; j < _pixelCount; j++ )
  {
    _current[j] = _target[j];
    _target[j].Id = 0;
  }
  
}

void LightSet::SetLight( int lightId, uint32_t color )
{
  if ( lightId < _pixelCount )
  {
		_target[lightId].Id = lightId;
		_target[lightId].Color = color;

		_transitionColor[lightId] = PrecisionColor(_current[lightId].Color, _target[lightId].Color,steps);
  }
}
