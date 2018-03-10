import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-scene-dialog',
  templateUrl: './edit-scene-dialog.component.html',
  styleUrls: ['./edit-scene-dialog.component.css']
})
export class EditSceneDialogComponent implements OnInit {

  constructor(public dialog: MatDialogRef<EditSceneDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {  }

  onClickClose() {
    this.dialog.close();
  }

  ngOnInit() {
  }

}
