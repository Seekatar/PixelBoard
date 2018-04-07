import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SelectSceneDialogComponent } from '../select-scene-dialog/select-scene-dialog.component';
import { Scene } from '../model/models';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  public scenes: Scene[];
  public displayedColumns = ['sortOrder', 'name', 'edit', 'delete'];

  constructor(private _service: PixelBoardService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  public async addScene() {
    const scenes = await this._service.getScenes();
    const openDlg = this.dialog.open(SelectSceneDialogComponent, {
      width: '30em',
      data: {
        scenes: scenes
      }
    });

    openDlg.afterClosed().subscribe(result => {
      if (result) {
        this.scenes.push(result);
      }
    });

  }
}
