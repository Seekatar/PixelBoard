import { Component, OnInit, Input } from '@angular/core';
import { Instrument } from '../model/models';

@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css']
})

export class InstrumentListComponent implements OnInit {

  @Input()
  instruments: Instrument[];
  constructor() { }

  ngOnInit() {
  }
}
