import { PlayerScore } from './../player/playerScore';
import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public Top3Players = new Observable<PlayerScore[]>();

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.Top3Players = this.httpClient.get<PlayerScore[]>(`${environment.baseURL}PlayerScore/Top3`)
      .pipe(map(player => player.map(p => new PlayerScore(p))))
  }

}
