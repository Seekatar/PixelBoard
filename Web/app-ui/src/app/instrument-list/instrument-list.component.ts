import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Instrument } from '../model/models';
import { ColorClickedEvent } from '../instrument/instrument.component';

export class InstrumentColorChangedEvent {
  constructor(event: ColorClickedEvent, instrumentList: Instrument[]) {
    this.Instruments = [];
    if (event.Instrument.checked) {
      this.Instruments = instrumentList.filter(inst => inst.checked);
    } else {
      this.Instruments.push(event.Instrument);
    }
    this.Color = event.Color;
    if (!event.Color) {
      this.Color = event.Instrument.color;
    }
  }

  Instruments: Instrument[];
  Color: string;
}

@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css']
})

export class InstrumentListComponent implements OnInit {

  @Input()
  instruments: Instrument[];
  @Input()
  enabled: boolean;
  @Input()
  loading: boolean;
  @Output()
  checkChanged = new EventEmitter<Number>();
  @Output()
  instrumentColorChanged = new EventEmitter<InstrumentColorChangedEvent>();

  private _totalChecked = 0;

  constructor() { }

  ngOnInit() {
  }

  getInstruments() {
    return this.instruments;
  }

  checked(checked: boolean) {
    // count since SetAll/ClearAll from above doesn't fire
    this._totalChecked = 0;
    this.instruments.forEach(inst => {
      this._totalChecked += inst.checked ? 1 : 0;
    });
    this.checkChanged.emit(this._totalChecked);
  }

  onColorClicked(event: ColorClickedEvent) {
    this.instrumentColorChanged.emit(new InstrumentColorChangedEvent(event, this.instruments));
  }
}
