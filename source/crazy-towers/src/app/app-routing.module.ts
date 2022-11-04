import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HighscoresComponent } from './highscores/highscores.component';
import { GameComponent } from './game/game.component';
import { GameOverComponent } from './game-over/game-over.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'game',
    component: GameComponent,
  },
  {
    path: 'game-over',
    component: GameOverComponent,
  },
  {
    path: 'highscores',
    component: HighscoresComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
