import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-show-dialog',
  templateUrl: './edit-show-dialog.component.html',
  styleUrls: ['./edit-show-dialog.component.css']
})
export class EditShowDialogComponent implements OnInit {

  constructor(public dialog: MatDialogRef<EditShowDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {  }

  onClickClose() {
    this.dialog.close();
  }

  ngOnInit() {
  }

}
