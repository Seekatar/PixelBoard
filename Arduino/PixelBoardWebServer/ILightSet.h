#ifndef __ILIGHTSET_H__
#define __ILIGHTSET_H__

#include <stdint.h>

class ILightSet
{
public:  
  virtual bool Initialize() = 0;
  virtual void SetLight( int lightId, uint32_t color ) = 0;
  virtual void ShowLights() = 0;
};

#endif