import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise'
import { Instrument, InstrumentType, Scene } from "./model/models"

@Injectable()
export class PixelBoardService {

  private _baseUri = "http://192.168.1.110:3000/api";

  constructor(private http: Http) { }

  public deleteScene(scene: Scene) {
    const url = `${this._baseUri}/scenes/${scene._id}`

    return this.http
      .delete(url)
      .toPromise()
      .then(res => {
        console.log( `Delete returned ${JSON.stringify(res)}`);
      })
      .catch(this.handleError);
  }

  public getScene(name: string) {
    const url = `${this._baseUri}/scenes/${name}`

    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as Scene)
      .catch(this.handleError);

  }

  public getScenes() {
    const url = `${this._baseUri}/scenes`

    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as Scene[])
      .catch(this.handleError);

  }

  public setScene(instruments: Instrument[]) {

    const url = `${this._baseUri}/scenes/0`
    let sockets = [];
    instruments.forEach(inst => {
      let colorNum = parseInt(`0x${inst.color.substr(1)}`)
      if (inst.instrumentType.colorScheme === "GRB")
        colorNum = (colorNum & 0xff0000) >> 8 | (colorNum & 0xff00) << 8 | (colorNum & 0xff);

      sockets.push({
        "socket": inst.socket,
        "color": colorNum
      })
    });
    const body = {
      transition: "1sec",
      sockets: sockets
    };

    return this.http
      .put(url, body)
      .toPromise()
      .then(res => res.json() as Instrument[])
      .catch(this.handleError);
  }

  public updateScene(scene: Scene) {

    const url = `${this._baseUri}/scenes/${scene._id}`

    const body = scene;

    return this.http
      .put(url, body)
      .toPromise()
      .then(res => res.json() as Scene)
      .catch(this.handleError);
  }

  public saveScene(scene: Scene) {

    const url = `${this._baseUri}/scenes`

    const body = scene;

    return this.http
      .post(url, body)
      .toPromise()
      .then(res => res.json() as Scene)
      .catch(this.handleError);
  }


  handleError(error: any): Promise<any> {
    console.error('Error from http call', error)
    return Promise.reject(error.message || error);
  }

  public getInstruments(): Promise<Instrument[]> {
    let url = `${this._baseUri}/instruments?full=1`

    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as Instrument[])
      .catch(this.handleError);
  }

  public expandInstruments( instruments: Instrument[] ) {
    const expandedCount = instruments.map( i => i.instrumentType.instrumentCount).reduce( (total, count) => count+total);
    const expanded: Instrument[] = [];
    let address = 0;
    instruments.forEach( instrument => {
      expanded.push(instrument);
      instrument.address = address++;
      for ( let j = 1; j < instrument.instrumentType.instrumentCount; j++) {
        const copy = Object.assign({}, instrument);
        copy.address = address++;
        expanded.push(copy);
      }
    });
    return expanded;
  }

  public setInstrument(instrument: Instrument, color: string) {
    const url = `${this._baseUri}/instruments/${instrument.socket}`
    const colorNum = parseInt(`0x${color.substr(1)}`)

    const body = { color: colorNum }

    return this.http
      .patch(url, body)
      .toPromise()
      .then(res => res.json() as Instrument[])
      .catch(this.handleError);

  }

  public getInstrumentTypes(): Promise<InstrumentType[]> {
    const url = `${this._baseUri}/instrumentTypes`

    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as InstrumentType[])
      .catch(this.handleError);
  }

}
