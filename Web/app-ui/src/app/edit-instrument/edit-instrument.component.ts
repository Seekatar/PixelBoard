import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-instrument',
  templateUrl: './edit-instrument.component.html',
  styleUrls: ['./edit-instrument.component.css']
})
export class EditInstrumentComponent implements OnInit {

  constructor(public dialog: MatDialogRef<EditInstrumentComponent>,
      @Inject(MAT_DIALOG_DATA)
      public data: any
    ) {  }

  onClickClose() {
    this.dialog.close();
  }

  ngOnInit() {
  }

}
