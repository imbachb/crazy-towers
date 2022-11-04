import { Component } from '@angular/core';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent {
  get score() {
    return +(sessionStorage.getItem('score') ?? '0');
  }
}
