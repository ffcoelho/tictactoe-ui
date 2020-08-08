import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchRequestModel } from '../models/web.model';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  apiUrl = 'http://127.0.0.1:9000';

  constructor(private http: HttpClient) { }

  getApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  postCreateMatch(): Observable<any> {
    return this.http.post(`${this.apiUrl}/match`, null);
  }

  postJoinMatch(reqObj: MatchRequestModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/join`, reqObj);
  }
}
