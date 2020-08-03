
interface RoomModel {
  available: boolean;
}

interface PlayerModel {
  id: string;
  name: string;
  online: boolean;
}

interface GameStateModel {
  turn: number;
  table: number;
}

export interface MatchModel {
  id: string;
  active: boolean;
  players: PlayerModel[];
  state: GameStateModel;
}

export interface LobbyResponseModel {
  rooms: RoomModel[];
}

export interface MatchResponseModel {
  id: string;
}

export interface MatchRequestModel {
  matchId: string;
  id: string;
  name: string;
}

export interface JoinMatchRequestModel {
  matchId: string;
  playerId: string;
}
