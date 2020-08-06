import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { MatchModel, JoinMatchRequestModel } from '../models/web.model';

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

  joinMatch(info: JoinMatchRequestModel): Observable<MatchModel> {
    if (!this.initialized) {
      this.setupSocketConnection();
    }
    this.socket.emit('join', info);
    return new Observable<MatchModel>(observer => {
      this.socket.on('update', (roomData: MatchModel) => {
        if (!roomData.active) {
          this.socket.disconnect();
        }
        observer.next(roomData);
      });
    });
  }

  play(place: number): void {
    if (this.socket.disconnected) {
      return;
    }
    this.socket.emit('play', place);
  }
}
