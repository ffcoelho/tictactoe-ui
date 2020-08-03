import { Injectable } from '@angular/core';

import * as FontFaceObserver from 'fontfaceobserver';

@Injectable({
  providedIn: 'root'
})
export class InitializerService {

  initialized = false;

  fontsData = {
    'Rock Salt': { weight: 400 },
    'Mansalva': { weight: 400 },
    'Play': { weight: 400 },
  };

  fontObservers = [];

  constructor() { }

  start(): Promise<any> {
    if (this.initialized) {
      return null;
    }
    this.initialized = true;
    return new Promise((resolve, reject) => {
      Object.keys(this.fontsData).forEach(family => {
        const data = this.fontsData[family];
        const obs = new FontFaceObserver(family, data);
        this.fontObservers.push(obs.load(null, 3500));
      });
      Promise.all(this.fontObservers)
      .then(fonts => {
        resolve();
      })
      .catch(err => {
        resolve();
      });
    });
  }
}
