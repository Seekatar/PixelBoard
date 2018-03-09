import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { Instrument } from '../model/models';

@Component({
  selector: 'app-instrument-config',
  templateUrl: './instrument-config.component.html',
  styleUrls: ['./instrument-config.component.css']
})
export class InstrumentConfigComponent implements OnInit {

  public instruments: Instrument[];
  public displayedColumns = ["socket","name","type","count"];

  constructor(private _service: PixelBoardService) { }

  ngOnInit() {
      this._service
        .getInstruments(true)
        .then(inst => {
          this.instruments = inst;
        });
      ;
    }

}
