#ifndef __MODEL_H__
#define __MODEL_H__

#include <stdint.h>

// color split into RGB with 8 extra bits of precision
class PrecisionColor
{
public:
	PrecisionColor(uint32_t startColor, uint32_t endColor, uint16_t steps = 0) {

		if ((endColor & 0xff0000) > (startColor & 0xff0000))
		{
			rAdd = true;
			r = (((endColor & 0xff0000) - (startColor & 0xff0000)) >> 8) / steps;
		}
		else
		{
			rAdd = false;
			r = (((startColor & 0xff0000) - (endColor & 0xff0000)) >> 8 ) / steps;
		}

		if ((endColor & 0xff00) > (startColor & 0xff00))
		{
			gAdd = true;
			g = ((endColor & 0xff00) - (startColor & 0xff00)) / steps;
		}
		else
		{
			gAdd = false;
			g = ((startColor & 0xff00) - (endColor & 0xff00)) / steps;
		}

		if ((endColor & 0xff) > (startColor & 0xff))
		{
			bAdd = true;
			b = (((endColor & 0xff) - (startColor & 0xff)) << 8 ) / steps;
		}
		else
		{
			bAdd = false;
			b = (((startColor & 0xff) - (endColor & 0xff)) << 8 ) / steps;
		}
	}

	PrecisionColor(PrecisionColor &src) {
		r = src.r;
		g = src.g;
		b = src.b;
		rAdd = src.rAdd;
		gAdd = src.gAdd;
		bAdd = src.bAdd;
	}

	PrecisionColor(uint32_t color = 0) {
		r = (color & 0xff0000) >> 8;
		g = (color & 0x00ff00);
		b = (color & 0x0000ff) << 8;
		rAdd = true;
		gAdd = true;
		bAdd = true;
	}
	bool rAdd;
	bool gAdd;
	bool bAdd;
	uint16_t r;
	uint16_t g;
	uint16_t b;
	uint32_t ToColor() {
		return ((r & 0xff00) << 8) | (g & 0xff00) | (b >> 8);
	}

	PrecisionColor operator+=(const PrecisionColor &add)
	{
		if (add.rAdd)
			r += add.r;
		else
			r -= add.r;

		if (add.gAdd)
			g += add.g;
		else
			g -= add.g;

		if (add.bAdd)
			b += add.b;
		else
			b -= add.b;

		return *this;
	}

};

class Light
{
public:
    Light( uint16_t id = 0, uint32_t color = 0)
    {
        Id = id;
        Color = color;
        CurrentColor = color;
    }

    uint16_t Id;
    uint32_t Color;
    PrecisionColor CurrentColor;

    Light &operator=(const Light& src)
    {
        Id = src.Id;
        Color = src.Color;
        CurrentColor = src.Color;
    }
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