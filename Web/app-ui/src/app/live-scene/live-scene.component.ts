import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { Instrument } from '../model/models';
import { EditSceneDialogComponent } from '../edit-scene-dialog/edit-scene-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-live-scene',
  templateUrl: './live-scene.component.html',
  styleUrls: ['./live-scene.component.css']
})
export class LiveSceneComponent implements OnInit {

  instruments: Instrument[];
  constructor(private _service: PixelBoardService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  selectedColor: string = "#ffffff";

  ngOnInit() {
    this.getInstruments();
    this.getLiveScene();
  }

  private getLiveScene() {
    const self = this;
    this._service
      .getScene("0")
      .then(scene => {
        console.log(scene);
        scene.instruments.forEach(inst => {
          const found = self.instruments.find(me => me.socket === inst.instrument_id);
          if (found) {
            const c = inst.color.toString(16);
            found.color = "#" + "0".repeat(6 - c.length) + c
            if (found.colorScheme === "GRB")
              found.color = "#" + found.color.substr(3, 2) + found.color.substr(1, 2) + found.color.substr(5, 2)
          }
          else
            console.log("Didn't find instr for id ", inst.instrument_id)

        });
      });
  }

  private getInstruments() {
    this._service
      .getInstruments()
      .then(inst => {
        this.instruments = inst;
        this.instruments.forEach(inst => { inst.color = "#000000" })
      });
    ;
  }

  setChecked() {
    this.instruments
      .filter(inst => inst.checked)
      .forEach(inst => {
        inst.color = this.selectedColor;
      });
  }

  selectAll() {
    this.instruments.forEach(inst => {
      inst.checked = true;
    });
  }

  clearAll() {
    this.instruments.forEach(inst => {
      inst.checked = false;
    });
  }

  invertAll() {
    this.instruments.forEach(inst => {
      inst.checked = !inst.checked;
    });
  }

  setScene() {
    this._service.setScene(this.instruments.filter(inst => inst.checked));
  }

  saveScene() {
    const openDlg = this.dialog.open(EditSceneDialogComponent, {
      width: "30em",
      data: {
        title: "Add Scene",
        scene: {
          name: "",
          transition: { name: "1sec" },
          instruments: this.instruments
        }
      }
    });

    openDlg.afterClosed().subscribe(result => {
      console.debug('Saved scene', result);
      if (result) {
        this._service.saveScene(result)
          .then(ok => {
            this.snackBar.open(`Scene '${result.name}' saved`, null, {
              duration: 3000
            });
          })
          .catch(err => {
            console.log("saveResult is ", err);
            const jsonErr = err.json()
            let errMsg = err
            if ( jsonErr.message)
              errMsg = jsonErr.message;
            else if ( jsonErr.errmsg )
              errMsg = jsonErr.errmsg
            this.snackBar.open("Save failed:\n" + errMsg, "Ok");
          });

      }
    });

  }

}
