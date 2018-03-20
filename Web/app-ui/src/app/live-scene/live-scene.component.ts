import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { Instrument } from '../model/models';
import { EditSceneDialogComponent } from '../edit-scene-dialog/edit-scene-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SelectSceneDialogComponent } from '../select-scene-dialog/select-scene-dialog.component';

@Component({
  selector: 'app-live-scene',
  templateUrl: './live-scene.component.html',
  styleUrls: ['./live-scene.component.css']
})
export class LiveSceneComponent implements OnInit {

  instruments: Instrument[];
  loaded = false;
  loading = true;
  constructor(private _service: PixelBoardService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  selectedColor: string = "#ffffff";

  anyChecked = false;

  async ngOnInit() {
    await this.getInstruments();
    this.getLiveScene();
  }

  private getLiveScene() {
    const self = this;
    this.loading = true;
    this._service
      .getScene("0")
      .then(scene => {
        console.log(scene);
        scene.instruments.forEach(inst => {
          const found = self.instruments.find(me => me.address === inst.instrument_id);
          if (found) {
            const c = inst.color.toString(16);
            found.color = "#" + "0".repeat(6 - c.length) + c
            if (found.instrumentType.colorScheme === "GRB")
              found.color = "#" + found.color.substr(3, 2) + found.color.substr(1, 2) + found.color.substr(5, 2)
          }
          else
            console.log("Didn't find instr for id ", inst.instrument_id)
          this.loaded = true;
          this.loading = false;
        });
      }).catch((err) => {
        this.loading = false;
        this.loaded = true; // TEMP to allow editing
        this.snackBar.open("Failed to get live data:\n" + err, "Ok");
      });
  }

  private async getInstruments() {
    await this._service
      .getInstruments()
      .then(inst => {
        this.instruments = this._service.expandInstruments(inst);
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
    this.anyChecked = true;
  }

  clearAll() {
    this.instruments.forEach(inst => {
      inst.checked = false;
    });
    this.anyChecked = false;
  }

  invertAll() {
    let checked = 0
    this.instruments.forEach(inst => {
      inst.checked = !inst.checked;
      checked += inst.checked ? 1 : 0
    });
    this.anyChecked = checked > 0;
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
          description: "",
          transition: { name: "1sec" }
        }
      }
    });

    openDlg.afterClosed().subscribe(result => {
      console.debug('Saved scene', result);
      if (result) {
        result['instruments'] = this.instruments.map( (inst,index) => { return {index:index, color: inst.color } });
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
            if (jsonErr.message)
              errMsg = jsonErr.message;
            else if (jsonErr.errmsg)
              errMsg = jsonErr.errmsg
            this.snackBar.open("Save failed:\n" + errMsg, "Ok");
          });

      }
    });

  }

  async loadScene() {
    const scenes = await this._service.getScenes();
    const openDlg = this.dialog.open(SelectSceneDialogComponent, {
      width: "30em",
      data: {
        scenes: scenes
      }
    });

    openDlg.afterClosed().subscribe(result => {
      console.debug('Loaded scene', result);
      if (result) {
        const scene = scenes.find( s => s._id === result );
        scene.instruments.forEach( (inst,index) => {
          if ( index < this.instruments.length )
            this.instruments[index].color = inst.color;
          else
            console.warn(`Index in scene passed current instrument list ${index}`)
        });
        this.snackBar.open(`Loaded scene '${scene.name}'`, null, {
          duration: 3000
        });
      }
    });


  }
  
  onCheckChanged( count: Number ){
    this.anyChecked = count > 0;
  }

}
