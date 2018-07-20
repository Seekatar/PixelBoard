import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Scene } from '../model/models';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditSceneDialogComponent } from '../edit-scene-dialog/edit-scene-dialog.component';

@Component({
  selector: 'app-scene-config',
  templateUrl: './scene-config.component.html',
  styleUrls: ['./scene-config.component.css']
})
export class SceneConfigComponent implements OnInit {

  public scenes: Scene[];
  public displayedColumns = ['sortOrder', 'name', 'edit', 'delete'];

  constructor(private _service: PixelBoardService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this._service
      .getScenes()
      .then(scenes => {
        this.scenes = scenes;
      });
  }

  public clickEdit(scene: Scene) {
    const copy = Object.assign({}, scene);
    const openDlg = this.dialog.open(EditSceneDialogComponent, {
      width: '30em',
      data: {
        title: 'Edit Scene',
        scene: copy
      }
    });

    openDlg.afterClosed().subscribe(changedScene => {
      if (changedScene) {
        this._service.setLiveScene(changedScene);
        scene = changedScene;
        this.snackBar.open(`Scene '${scene.name}' updated`, null, {
          duration: 3000
        });
      }
    });

  }

  public clickDel(scene: Scene) {
    const openDlg = this.dialog.open(ConfirmDialogComponent, {
      width: '40em',
      data: {
        title: 'Delete Scene',
        question: `Are you sure you want to delete '${scene.name}'`,
        okText: 'Yes',
        closeText: 'No',
        icon: 'fa-question-circle',
        scene: scene
      }
    });

    openDlg.afterClosed().subscribe(sceneToDelete => {
      if (sceneToDelete) {
        this._service.deleteScene(sceneToDelete);
        const index = this.scenes.findIndex(s => s === sceneToDelete);
        this.scenes.splice(index, 1);
        this.snackBar.open(`Scene '${sceneToDelete.name}' deleted`, null, {
          duration: 3000
        });
      }
    });
  }

}
