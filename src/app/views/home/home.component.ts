import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InitializerService } from 'src/app/services/initializer.service';
import { WebService } from '../../services/web.service';
import { SocketService } from '../../services/socket.service';
import { MatchRequestModel, MatchModel } from '../../models/web.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public roomsData: any;
  public matchData: MatchModel;
  public joinForm: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private initSvc: InitializerService,
              private webSvc: WebService,
              private socketSvc: SocketService) { }

  ngOnInit(): void {
    console.log('a');
    if (!this.initSvc.initialized) {
      console.log('b');
      this.router.navigateByUrl('/');
      return;
    }
    console.log('c');
    this.joinForm = this.fb.group({
      matchId: [ null ],
      id: [ null ],
      name: [ null ]
    });
    this.webSvc.getLobby().subscribe(rooms => this.roomsData = rooms);
  }

  create(): void {
    this.webSvc.postCreateMatch().subscribe(resp => {
      this.joinForm.get('matchId').patchValue(resp.matchId);
    });
  }

  join(): void {
    this.webSvc.postJoinMatch(this.joinForm.value).subscribe(resp => {
      this.socketSvc.setupSocketConnection();
      this.socketSvc.joinMatch(
        {
          matchId: this.joinForm.get('matchId').value,
          playerId: resp.playerId
        }
      ).subscribe(data => {
        this.updateMatchData(data);
      });
      this.joinForm.get('id').patchValue(resp.matchId);
    });
  }

  updateMatchData(data: any): void {
    this.matchData = data;
  }

}
