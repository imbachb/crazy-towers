import { RegistrationComponent } from './registration/registration.component';
import { HighscoresComponent } from './highscores/highscores.component';
import { GameComponent } from './game/game.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
