import { PlayerScore } from './playerScore';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public CurrentPlayer = new PlayerScore({});

  constructor() { }
}
