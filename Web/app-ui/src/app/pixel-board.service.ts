import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise'
import { Instrument, InstrumentType } from "./model/models"

@Injectable()
export class PixelBoardService {

  private _baseUri = "http://localhost:3000/api";

  constructor(private http: Http) { }

  public setScene(instruments: Instrument[] ) {

    const url = `${this._baseUri}/scenes/0`
    let sockets = [];
    instruments.forEach( inst => {
      let colorNum = parseInt(`0x${inst.color.substr(1)}`)
      if ( inst.colorScheme === "GRB")
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

  handleError(error: any): Promise<any> {
    console.error('Error from http call', error)
    return Promise.reject(error.message || error);
  }

  public getInstruments(): Promise<Instrument[]> {
    const url = `${this._baseUri}/instruments`
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json() as Instrument[])
      .catch(this.handleError);
  }

  public setInstrument( instrument: Instrument, color: string ) {
    const url = `${this._baseUri}/instruments/${instrument.socket}`
    const colorNum = parseInt(`0x${color.substr(1)}`)

    const body = {color: colorNum}

    return this.http
      .patch(url, body)
      .toPromise()
      .then(res => res.json() as Instrument[])
      .catch(this.handleError);

  }
}
