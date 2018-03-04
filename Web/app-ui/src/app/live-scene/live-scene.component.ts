import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { Instrument } from '../model/models';

@Component({
  selector: 'app-live-scene',
  templateUrl: './live-scene.component.html',
  styleUrls: ['./live-scene.component.css']
})
export class LiveSceneComponent implements OnInit {

  instruments: Instrument[];
  constructor(private _service: PixelBoardService) { }

  selectedColor: string;

  ngOnInit() {
    this.getInstruments();
  }

  private getInstruments() {
    this._service
      .getInstruments()
      .then(inst => this.instruments = inst);
  }

  setChecked() {
    this.instruments
      .filter( inst => inst.checked)
      .forEach(inst => {
        inst.color = this.selectedColor;
    });
  }

  selectAll() {
    this.instruments.forEach(inst => {
      inst.checked = true;
    });
  }

  clearAll() {
    this.instruments.forEach(inst => {
      inst.checked = false;
    });
  }

  invertAll() {
    this.instruments.forEach(inst => {
      inst.checked = !inst.checked;
    });
  }
}
