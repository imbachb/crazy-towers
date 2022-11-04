import { PlayerScore } from '../player/playerScore';
import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss']
})
export class HighscoresComponent implements OnInit {
  
  displayedColumns: string[] = ['name', 'school', 'score'];
  
  public PlayerHighscores = new Observable<PlayerScore[]>();

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.PlayerHighscores = this.httpClient.get<PlayerScore[]>(
      `${environment.baseURL}PlayerScore`)
      .pipe(map(player => player.map(p => new PlayerScore(p))))

      
  }
}
