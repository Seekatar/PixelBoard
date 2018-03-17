import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InstrumentType } from '../model/models';
import { PixelBoardService } from '../pixel-board.service';

@Component({
  selector: 'app-edit-instrument',
  templateUrl: './edit-instrument.component.html',
  styleUrls: ['./edit-instrument.component.css']
})
export class EditInstrumentComponent implements OnInit {

  constructor(private _service: PixelBoardService, public dialog: MatDialogRef<EditInstrumentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any ) 
  {
  }

  @Input()
  instTypes: InstrumentType[];

  onClickClose() {
    this.dialog.close();
  }

  ngOnInit() {
  }

}
