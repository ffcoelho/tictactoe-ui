import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InitializerService } from 'src/app/services/initializer.service';
import { WebService } from '../../services/web.service';
import { SocketService } from '../../services/socket.service';
import { MatchRequestModel, MatchModel } from '../../models/web.model';

export enum HomeState {
  OPTIONS = 'options',
  CREATE = 'create',
  JOIN = 'join',
  GAME = 'game'
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  get appInitialized(): boolean {
    return this.initSvc.initialized;
  }

  public homeState = HomeState.OPTIONS;
  public roomsData: any;
  public matchData: MatchModel;
  public homeForm: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private initSvc: InitializerService,
              private webSvc: WebService,
              private socketSvc: SocketService) { }

  ngOnInit(): void {
    // mock
    this.matchData = {
      id: 'test',
      active: true,
      players: [
        { id: 'H2qnFCnH5a', name: 'Player 1', online: true },
        { id: 'H2qnFCnH5b', name: 'Player 2', online: true },
      ],
      state: {
        turn: 0,
        table: 111111111
      }
    };
    this.homeState = HomeState.GAME;
    // mock
    if (!this.initSvc.initialized) {
      this.router.navigateByUrl('/');
      return;
    }
    this.homeForm = this.fb.group({
      matchId: [ null, Validators.required ],
      id: [ null, Validators.required ],
      name: [ null, Validators.required ]
    });
    this.webSvc.getLobby().subscribe(rooms => this.roomsData = rooms);
  }

  selectCreate(): void {
    this.homeState = HomeState.CREATE;
  }

  selectJoin(): void {
    this.homeState = HomeState.JOIN;
  }

  backToOptions(): void {
    this.homeState = HomeState.OPTIONS;
  }

  create(): void {
    this.webSvc.postCreateMatch().subscribe(resp => {
      this.homeForm.get('matchId').patchValue(resp.matchId);
      this.join();
    });
  }

  join(): void {
    this.webSvc.postJoinMatch(this.homeForm.value).subscribe(resp => {
      this.homeForm.get('id').patchValue(resp.matchId);
      this.socketSvc.joinMatch(
        {
          matchId: this.homeForm.get('matchId').value,
          playerId: resp.playerId
        }
      ).subscribe(data => {
        this.updateMatchData(data);
        this.homeState = HomeState.GAME;
      });
    });
  }

  updateMatchData(data: any): void {
    this.matchData = data;
  }

  avatar(name: string): string {
    const formattedName = name.replace(/ /g, '_');
    return `https://api.adorable.io/avatars/96/${formattedName}.png`
  }
}
