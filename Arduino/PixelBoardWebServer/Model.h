#ifndef __MODEL_H__
#define __MODEL_H__

#include <stdint.h>

class Light
{
public:
    Light( uint16_t id = 0, uint32_t color = 0)
    {
        Id = id;
        Color = color;
    }

    uint16_t Id;
    uint32_t Color;
};

class Scene
{
    Light *_lights;
    uint16_t _count;
public:
    Scene( uint16_t count ) 
    {
        _count = count;
        _lights = new Light[count];
        for ( int i = 0; i < _count; i++ )
            _lights[i].Id = i;
    }
    Light *operator[](uint16_t i) 
    {
        if ( i < _count )
            return &_lights[i];
        else
            return NULL;
    }
    int Count() const { return _count; }
    ~Scene() 
    {
        delete [] _lights;
    }
    
};

#endif