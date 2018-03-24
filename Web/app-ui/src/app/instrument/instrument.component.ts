import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Instrument } from '../model/models';
import { MaterialsModule } from "../materials/materials.module"
import { PixelBoardService } from '../pixel-board.service';

export class ColorClickedEvent {
  constructor( instrument: Instrument, color?: string ) {
    this.Color = color;
    this.Instrument = instrument;
  }
  public Color: string;
  public Instrument: Instrument;
}

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.css']
})
export class InstrumentComponent implements OnInit {

  _enabled: boolean;

  @Input()
  instrument: Instrument;

  @Input()
  color: string;

  @ViewChild('colorSquare')
  colorSquare: ElementRef;

  @Input()
  set enabled( enabled: boolean ) {
    this._enabled = enabled;
    this.colorSquare.nativeElement.classList.remove("disabled-color-square");
  }
  get enabled() { return this._enabled; }

  @Output()
  onChecked = new EventEmitter<boolean>();

  @Output()
  onColorClicked = new EventEmitter<ColorClickedEvent>();

  constructor(private _board: PixelBoardService) { }

  showText = false;
  ngOnInit() {
  }

  getSocket() {
    if ( !this.instrument || !this.instrument.instrumentType || !this.instrument.instrumentType.instrumentCount)
      console.error("Null or undefined instrument!");
    else if ( this.instrument.instrumentType.instrumentCount === 1)
      return this.instrument.socket;
    else
      return `${this.instrument.socket}:${this.instrument.address-this.instrument.socket}`
  }

  bump(color: string = "#ffffff") {
    console.log("Bumping", this.instrument.name);
    this._board.bumpInstrument(this.instrument, color );
  }

  checked() {
    this.instrument.checked = !this.instrument.checked;
    this.onChecked.emit(this.instrument.checked);
  }

  setColor(color: string) {
    this.onColorClicked.emit(new ColorClickedEvent(this.instrument, color));
  }

}
