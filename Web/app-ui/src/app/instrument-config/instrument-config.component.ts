import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { Instrument } from '../model/models';
import { MatDialog } from '@angular/material';
import { EditInstrumentComponent } from '../edit-instrument/edit-instrument.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-instrument-config',
  templateUrl: './instrument-config.component.html',
  styleUrls: ['./instrument-config.component.css']
})
export class InstrumentConfigComponent implements OnInit {

  public instruments: Instrument[];
  public displayedColumns = ["socket", "name", "type", "count", "edit", "delete"];

  constructor(private _service: PixelBoardService, public dialog: MatDialog) { }

  ngOnInit() {
    this._service
      .getInstruments(true)
      .then(inst => {
        this.instruments = inst;
      });
    ;
  }

  public addInstrument() {
    const openDlg = this.dialog.open(EditInstrumentComponent, {
      width: "30em",
      data: {
        title: "Add Instrument",
        instrument: {
          socket: 0,
          name: "",
          instrumentType: "option3"
        }
      }
    });

    openDlg.afterClosed().subscribe(result => {
      console.log('YOOOOOOO!', result);
    });

  }

  public clickEdit(instrument: Instrument) {
    let copy = Object.assign( {}, instrument )
    const openDlg = this.dialog.open(EditInstrumentComponent, {
      width: "30em",
      data: {
        title: "Edit Instrument",
        instrument: copy
      }
    });

    openDlg.afterClosed().subscribe(result => {
      console.log('YOOOOOOO!', result);
    });

  }

  public clickDel(instrument: Instrument) {
    const openDlg = this.dialog.open(ConfirmDialogComponent, {
      width: "40em",
      data: {
        title: "Delete Instrument",
        question: `Are you sure you want to delete '${instrument.name}'`,
        okText: "Yes",
        closeText: "No",
        icon: "fa-question-circle",
        result: instrument
      }
    });

    openDlg.afterClosed().subscribe(result => {
      console.log('YOOOOOOO!', result);
    });
  }
}

