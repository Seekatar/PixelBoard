import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { Instrument } from '../model/models';

@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css']
})

export class InstrumentListComponent implements OnInit {

  instruments: Instrument[];
  constructor(private _service : PixelBoardService ) { }

  ngOnInit() {
    this.getInstruments();
  }

 private getInstruments () {
   this._service
      .getInstruments()
      .then( inst => this.instruments = inst );
 }
}
