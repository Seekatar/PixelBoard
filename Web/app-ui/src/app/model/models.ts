import { Input } from '@angular/core';

export class InstrumentType {
  _id: string;
  typeName: string;
  typeShortName: string;
  manufacturer: string;
  url: string;
  maxVoltage: number;
  instrumentCount: number;
  colorScheme: string;
}

export class Instrument {
  _id: string;
  name: string;
  socketOffset: number;
  socket: number;
  address: number;
  instrumentType: InstrumentType;
  color: string;
  checked: boolean;
}

export class InstrumentColor {
  index: number;
  color: string;
}

export class Scene {
  _id: string;
  name: string;
  description: string;
  transition: string;
  instruments: InstrumentColor[];
}
