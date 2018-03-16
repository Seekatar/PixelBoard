import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Instrument } from '../model/models';
import { MaterialsModule } from "../materials/materials.module"
import { PixelBoardService } from '../pixel-board.service';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.css']
})
export class InstrumentComponent implements OnInit {

  @Input()
  instrument: Instrument;

  @Input()
  color: string;

  @Input()
  enabled: boolean;

  @Output()
  onChecked = new EventEmitter<boolean>();

  constructor(private _board: PixelBoardService) { }

  ngOnInit() {
  }

  bump() {
    console.log( "Setting color", this.color, " on ", this.instrument.name);
    this._board.setInstrument( this.instrument, this.color );
  }

  checked() {
    this.instrument.checked = !this.instrument.checked;
    this.onChecked.emit(this.instrument.checked);
  }
}
