import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Instrument } from '../model/models';

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
  @Output()
  checkChanged = new EventEmitter<Number>();

  private _totalChecked = 0

  constructor() { }

  ngOnInit() {
  }

  getInstruments() {
    return this.instruments;
  }
  
  onChecked( checked: boolean ) {
    // count since SetAll/ClearAll from above doesn't fire
    this._totalChecked = 0;
    this.instruments.forEach(inst => {
      this._totalChecked += inst.checked ? 1 : 0
    });
    this.checkChanged.emit( this._totalChecked );
  }
}
