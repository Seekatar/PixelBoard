import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Show } from '../model/models';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditShowDialogComponent } from '../edit-show-dialog/edit-show-dialog.component';

@Component({
  selector: 'app-show-config',
  templateUrl: './show-config.component.html',
  styleUrls: ['./show-config.component.css']
})
export class ShowConfigComponent implements OnInit {

  public shows: Show[];
  public displayedColumns = ['sortOrder', 'name', 'edit', 'delete'];

  constructor(private _service: PixelBoardService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this._service
      .getShows()
      .then(shows => {
        this.shows = shows;
      });
  }

  public clickEdit(show: Show) {
    const copy = Object.assign({}, show);
    const openDlg = this.dialog.open(EditShowDialogComponent, {
      width: '30em',
      data: {
        title: 'Edit Show',
        show: copy
      }
    });

    openDlg.afterClosed().subscribe(changedShow => {
      if (changedShow) {
        show = changedShow;
        this._service.saveShow(changedShow);
        this.snackBar.open(`Show '${show.name}' updated`, null, {
          duration: 3000
        });
      }
    });

  }

  public clickAdd() {
    const openDlg = this.dialog.open(EditShowDialogComponent, {
      width: '30em',
      data: {
        title: 'Add Show',
        show: {
          name: '',
          description: ''
        }
      }
    });

    openDlg.afterClosed().subscribe(result => {
      this._service.saveShow(result);
    });
  }

  public clickDel(show: Show) {
    const openDlg = this.dialog.open(ConfirmDialogComponent, {
      width: '40em',
      data: {
        title: 'Delete Show',
        question: `Are you sure you want to delete '${show.name}'`,
        okText: 'Yes',
        closeText: 'No',
        icon: 'fa-question-circle',
        show: show
      }
    });

    openDlg.afterClosed().subscribe(showToDelete => {
      if (showToDelete) {
        this._service.deleteShow(showToDelete);
        const index = this.shows.findIndex(s => s === showToDelete);
        this.shows.splice(index, 1);
        this.snackBar.open(`Show '${showToDelete.name}' deleted`, null, {
          duration: 3000
        });
      }
    });
  }

}
