import { Input } from "@angular/core";

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
  instrumentType_id: string;
  color: string;
  checked: boolean;
  colorScheme: string;
}

export class Scene {
  _id: string;
  name: string;
  transition: string;
  instruments: Instrument []
}
