import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { MatchRequestModel, MatchModel } from '../models/web.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  apiUrl = 'http://127.0.0.1:9000';

  initialized = false;
  socket: SocketIOClient.Socket;

  constructor() { }

  setupSocketConnection(): void {
    this.initialized = true;
    this.socket = io(`${this.apiUrl}`);
  }

  joinMatch(info: MatchRequestModel): Observable<MatchModel> {
    if (!this.initialized) {
      this.setupSocketConnection();
    }
    this.socket.emit('join', info);
    return new Observable<MatchModel>(observer => {
      this.socket.on('update', (roomData: MatchModel) => {
        if (!roomData.active) {
          observer.next(null);
          this.socket.disconnect();
          return;
        }
        observer.next(roomData);
      });
    });
  }
}
