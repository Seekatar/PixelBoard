import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Instrument, InstrumentType, Scene } from './model/models';

@Injectable()
export class PixelBoardService {

  private _baseUri = 'http://192.168.1.110:3000/api';
  private _bumpTimeout = 500;

  constructor(private http: Http) { }

  public bumpInstrument(instrument: Instrument, color: string) {
    const url = `${this._baseUri}/scenes/0`;

    const body = {
      transition: '0sec',
      sockets: [{
        socket: instrument.address,
        color: this.webToRgb(color, instrument.instrumentType.colorScheme)
      }
      ]
    };

    return this.http
      .put(url, body)
      .toPromise()
      .then(res => {
        setTimeout(resIgnored => {
          body.sockets[0].color = this.webToRgb(instrument.color, instrument.instrumentType.colorScheme);
          this.http
            .put(url, body)
            .toPromise()
            .then(httpRes => httpRes.json() as Instrument[]);
        }, this._bumpTimeout);
      })
      .catch(this.handleError);

  }

  public deleteScene(scene: Scene) {
    const url = `${this._baseUri}/scenes/${scene._id}`;

    return this.http
      .delete(url)
      .toPromise()
      .then(res => {
        console.log(`Delete returned ${JSON.stringify(res)}`);
      })
      .catch(this.handleError);
  }

  public getScene(name: string) {
    const url = `${this._baseUri}/scenes/${name}`;

    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as Scene)
      .catch(this.handleError);

  }

  public getScenes(): Promise<Scene[]> {
    const url = `${this._baseUri}/scenes`;

    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as Scene[])
      .catch(this.handleError);

  }

  private webToRgb(webColor: string, colorScheme: string): number {
    let colorNum = parseInt(`0x${webColor.substr(1)}`, 16);
    if (colorScheme === 'GRB') {
      /* tslint:disable:no-bitwise */
      colorNum = (colorNum & 0xff0000) >> 8 | (colorNum & 0xff00) << 8 | (colorNum & 0xff);
    }
    return colorNum;
  }

  public setScene(instruments: Instrument[], color?: string) {

    const url = `${this._baseUri}/scenes/0`;
    const sockets = [];
    instruments.forEach(inst => {

      const colorNum = this.webToRgb(color ? color : inst.color, inst.instrumentType.colorScheme);

      sockets.push({
        'socket': inst.address,
        'color': colorNum
      });
    });
    const body = {
      transition: '0sec',
      sockets: sockets
    };

    return this.http
      .put(url, body)
      .toPromise()
      .then(res => res.json() as Instrument[])
      .catch(this.handleError);
  }

  public updateScene(scene: Scene) {

    const url = `${this._baseUri}/scenes/${scene._id}`;

    const body = scene;

    return this.http
      .put(url, body)
      .toPromise()
      .then(res => res.json() as Scene)
      .catch(this.handleError);
  }

  public saveScene(scene: Scene) {

    const url = `${this._baseUri}/scenes`;

    const body = scene;

    return this.http
      .post(url, body)
      .toPromise()
      .then(res => res.json() as Scene)
      .catch(this.handleError);
  }


  handleError(error: any): Promise<any> {
    console.error('Error from http call', error);
    return Promise.reject(error.message || error);
  }

  public getInstruments(): Promise<Instrument[]> {
    const url = `${this._baseUri}/instruments?full=1`;

    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as Instrument[])
      .catch(this.handleError);
  }

  public expandInstruments(instruments: Instrument[]) {
    const expandedCount = instruments.map(i => i.instrumentType.instrumentCount).reduce((total, count) => count + total);
    const expanded: Instrument[] = [];
    let address = 0;
    instruments.forEach(instrument => {
      expanded.push(instrument);
      instrument.address = address++;
      for (let j = 1; j < instrument.instrumentType.instrumentCount; j++) {
        const copy = Object.assign({}, instrument);
        copy.address = address++;
        expanded.push(copy);
      }
    });
    return expanded;
  }

  public setInstrument(instrument: Instrument, color: string) {
    const url = `${this._baseUri}/instruments/${instrument.socket}`;
    const colorNum = parseInt(`0x${color.substr(1)}`, 16);

    const body = { color: colorNum };

    return this.http
      .patch(url, body)
      .toPromise()
      .then(res => res.json() as Instrument[])
      .catch(this.handleError);

  }

  public getInstrumentTypes(): Promise<InstrumentType[]> {
    const url = `${this._baseUri}/instrumentTypes`;

    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as InstrumentType[])
      .catch(this.handleError);
  }

}
