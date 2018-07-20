# NeoPixel Light Board
This a project I used to teach myself MEAN app development.  It uses the MEAN stack for the GUI and backend that talks to a REST server on an [Adafruit Feature M0 Wifi board](https://www.adafruit.com/product/3010) that controls [Neopixel LED](https://www.adafruit.com/product/1734) "lighting instruments"

![BugsAndPorky](/doc/images/bugsandporky.png "Bugs Bunny on Stage")

The current version allows for adding instruments and scenes and controlling the current state of the instruments.  It has logic to transition from one scene to the next.

# UI
The UI is Angular (the A in MEAN), and I tried to use Google Material design elements whenever possible.  

## Current Scene
From here you can set the current scene, load or save a scene.  Clicking `Set scene` will actually set the curent scene.

![CurrentScene](/doc/images/mainscreen.png)

## Items
The screens for viewing, adding and removing items are pretty much the same for instruments, scenes, and shows.

![Instruments](/doc/images/instruments.png)

![Scenes](/doc/images/scenes.png)

![Shows](/doc/images/shows.png)

# Backend
For the most part this is a typical REST backend in Express and Node (E and N) over a Mongo (M) datastore.  

In addition to CRUD operations on the server has an injectable service to talk to the hardware portion of the project.  Currently this is via HTTP REST.  Another option is to have the API server run on RaspberryPi and talk to an Ardunio via I2C (in prototype now).

# Hardware
The `Arduino` folder has the Sketch that runs on the M0 to control the Neopixels.  I created a custom board for easily chaining Neopixels together.  Here's the top:

![Top](/doc/images/hardwarefront.png)

Note that the plugs are asymmetrical to make sure you plug them in the correct way since orientation is important.  The resistor and capacitor are the ones recommended by Adafruit.

The back simply ties all the data outs to data ins and creates a +5V and GND bus.  Lots of tedious soldering.

![Back](/doc/images/hardwareback.jpg)
