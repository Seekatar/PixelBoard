import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-select-scene-dialog',
  templateUrl: './select-scene-dialog.component.html',
  styleUrls: ['./select-scene-dialog.component.css']
})
export class SelectSceneDialogComponent implements OnInit {

  constructor(public dialog: MatDialogRef<SelectSceneDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { }

  selectedScene: String;

  ngOnInit() {
  }

}
