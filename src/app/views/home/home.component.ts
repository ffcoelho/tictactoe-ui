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
  public avatars: any[];

  constructor(private router: Router,
              private fb: FormBuilder,
              private initSvc: InitializerService,
              private webSvc: WebService,
              private socketSvc: SocketService) { }

  ngOnInit(): void {
    // mock
    // this.matchData = {
    //   id: 'test',
    //   active: true,
    //   players: [
    //     { id: 'H2qnFCnH5a', name: 'Player 1', online: true },
    //     { id: 'H2qnFCnH5b', name: 'Player 2', online: true },
    //   ],
    //   state: {
    //     turn: 0,
    //     table: 111111111
    //   }
    // };
    // this.homeState = HomeState.GAME;
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
        if (!this.avatars) {
          this.avatarsInit(data.players);
        }
        if (this.avatars.length < 2 && data.players.length > 1) {
          this.updateAvatars(data.players[1]);
        }
        this.updateMatchData(data);
        this.homeState = HomeState.GAME;
      });
    });
  }

  updateMatchData(data: any): void {
    this.matchData = data;
  }

  avatarsInit(players: any[]): void {
    this.avatars = [];
    players.forEach((player: any) => {
      this.updateAvatars(player);
    });
  }

  updateAvatars(player: any): void {
    const formattedName = player.name.replace(/ /g, '_');
    this.avatars.push({
      loaded: false,
      url: `https://api.adorable.io/avatars/96/${formattedName}.png`
    });
  }

  selectId(): void {
    const matchIdInput: HTMLInputElement = document.getElementById('match-id') as HTMLInputElement;
    matchIdInput.select();
    matchIdInput.setSelectionRange(0, 99999);
  }

  copyInfo(): void {
    const matchIdInput: HTMLInputElement = document.getElementById('match-id') as HTMLInputElement;
    matchIdInput.select();
    matchIdInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    matchIdInput.blur();
  }

  keepInfo(): void {
    const matchIdInput: HTMLInputElement = document.getElementById('match-id') as HTMLInputElement;
    matchIdInput.value = this.matchData.id;
  }

  leaveGame(): void {
    window.location.reload();
  }
}
