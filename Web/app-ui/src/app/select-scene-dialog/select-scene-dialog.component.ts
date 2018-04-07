import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionList, MatSelectionListChange } from '@angular/material';

export class SceneInfo {
  SelectedScene: string;
  IgnoreBlack: true;
}

@Component({
  selector: 'app-select-scene-dialog',
  templateUrl: './select-scene-dialog.component.html',
  styleUrls: ['./select-scene-dialog.component.css']
})
export class SelectSceneDialogComponent implements OnInit {

  constructor(public dialog: MatDialogRef<SelectSceneDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.sceneInfo.IgnoreBlack = true;
  }

  sceneInfo = new SceneInfo();

  @ViewChild(MatSelectionList) scenes: MatSelectionList;

  ngOnInit() {
    this.scenes.selectionChange.subscribe((s: MatSelectionListChange) => {
      this.scenes.deselectAll();
      s.option.selected = true;
      this.sceneInfo.SelectedScene = s.option.value;
  });
  }

}
