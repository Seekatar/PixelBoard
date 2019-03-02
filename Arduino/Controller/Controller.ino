#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1
#define PIN 7
// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 8

// When we setup the NeoPixel library, we tell it how many pixels, and which pin to use to send signals.
// Note that for older NeoPixel strips you might need to change the third parameter--see the strandtest
// example for more information on possible values.
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

const int modeButtonPin = 11;
const int nextLightButtonPin = 10;
const int colorModePin = 9;
const int brightnessModePin = 8;

const int encoderPinA = 12;
const int encoderPinB = 13;

const bool BRIGHTNESSS_MODE = false;
const bool COLOR_MODE = true;

typedef uint32_t RgbColor;

byte colors[NUMPIXELS];
byte brightness[NUMPIXELS];

bool currentMode = COLOR_MODE;
int currentPixel = 0;

RgbColor Wheel(byte WheelPos);

RgbColor calcColor(RgbColor color, int brightness)
{
  if (brightness == 255)
    return color;
  if (brightness == 0)
    return 0;

  int r = color >> 16;
  int g = (color & 0xff00) >> 8;
  int b = color & 0xff;

  float f = (float)brightness / 255;
  return ((int)(r * f) * 65536) +
         ((int)(g * f) * 256) +
         (int)(b * f);
}

void setup()
{
  Serial.begin(115200);

  pinMode(colorModePin, OUTPUT);
  pinMode(brightnessModePin, OUTPUT);

  pinMode(encoderPinA, INPUT);
  pinMode(encoderPinB, INPUT);
  pinMode(modeButtonPin, INPUT_PULLUP);
  pinMode(nextLightButtonPin, INPUT_PULLUP);

  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined(__AVR_ATtiny85__)
  if (F_CPU == 16000000)
    clock_prescale_set(clock_div_1);
#endif
  // End of trinket special code
  digitalWrite(colorModePin, HIGH);
  digitalWrite(brightnessModePin, LOW);


  pixels.begin(); // This initializes the NeoPixel library.
  for (int i = 0; i < NUMPIXELS; i++)
  {
    colors[i] = 170; // 170 = blue, 85 = green, 0 = red
    brightness[i] = 255;
    pixels.setPixelColor(i, calcColor(Wheel(colors[i]), brightness[i]));
  }

  pixels.show();
}

int prevAState = -1;
int checkEncoder(int currentValue, int min, int max, int step, bool wrap)
{
  int aState = digitalRead(encoderPinA); // Reads the "current" state of the outputA
  if ( prevAState == -1 )
    prevAState = aState;

  // If the previous and the current state of the outputA are different, that means a Pulse has occured
  if (aState != prevAState)
  {
    // If the outputB state is different to the outputA state, that means the encoder is rotating clockwise
    if (digitalRead(encoderPinB) != aState)
    {
      currentValue += step;
      if (currentValue > max)
        currentValue = wrap ? min : max;
    }
    else
    {
      currentValue -= step;
      if (currentValue < min)
        currentValue = wrap ? max : min;
    }
    Serial.print("Encoder ");
    Serial.println(currentValue);
  }
  prevAState = aState; // Updates the previous state of the outputA with the current state

  return currentValue;
}

int lastEncodePos = 0;
int modeState = LOW;
int nextLightState = LOW;
int encoderStep = 6;

void loop()
{
  int prevPos = lastEncodePos;
  lastEncodePos = checkEncoder(lastEncodePos, 0, 255, encoderStep, currentMode == COLOR_MODE);

  if (prevPos != lastEncodePos)
  {
    if (currentMode == COLOR_MODE)
    {
      colors[currentPixel] = lastEncodePos;
    }
    else
    {
      brightness[currentPixel] = lastEncodePos;
    }
    RgbColor c = Wheel(colors[currentPixel]);

    RgbColor c2 = calcColor(c, brightness[currentPixel]);
    pixels.setPixelColor(currentPixel, c2);
    pixels.show(); // This sends the updated pixel color to the hardware.
  }

  int prevNextLightState = nextLightState;
  nextLightState = digitalRead(nextLightButtonPin);

  if (nextLightState == LOW && prevNextLightState != LOW)
  {
    currentPixel += 1;
    if (currentPixel >= NUMPIXELS)
      currentPixel = 0;

    if (currentMode == COLOR_MODE)
      lastEncodePos = colors[currentPixel];
    else
      lastEncodePos = brightness[currentPixel];

    pixels.setPixelColor(currentPixel, 0x101010 ); // blink to show which one
    pixels.show();
    delay(100);
    pixels.setPixelColor(currentPixel, calcColor(Wheel(colors[currentPixel]), brightness[currentPixel]) );
    pixels.show();
  }

  int prevModeState = modeState;
  modeState = digitalRead(modeButtonPin);
  if (modeState == LOW && prevModeState != LOW)
  {
    currentMode = !currentMode;
    digitalWrite(colorModePin, currentMode == COLOR_MODE ? HIGH : LOW);
    digitalWrite(brightnessModePin, currentMode == COLOR_MODE ? LOW : HIGH);

    if (currentMode == COLOR_MODE)
      lastEncodePos = colors[currentPixel];
    else
      lastEncodePos = brightness[currentPixel];
  }
  prevModeState = modeState;
}

// copied from Adafruit strandtest

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
RgbColor Wheel(byte WheelPos)
{
  WheelPos = 255 - WheelPos;
  if (WheelPos < 85)
  {
    return pixels.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if (WheelPos < 170)
  {
    WheelPos -= 85;
    return pixels.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return pixels.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}