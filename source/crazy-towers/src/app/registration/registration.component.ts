import { Router } from '@angular/router';
import { PlayerService } from './../player/player.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PlayerScore } from './../player/playerScore';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  name = new FormControl(this.playerService.CurrentPlayer.name, [Validators.required]);
  email = new FormControl(this.playerService.CurrentPlayer.email, [Validators.required, Validators.email]);
  school = new FormControl(this.playerService.CurrentPlayer.school, [Validators.required]);
  registerForNewsletter = new FormControl(this.playerService.CurrentPlayer.hasNewsletter);

  profileForm = new FormGroup({
    name: this.name,
    email: this.email,
    school: this.school,
    registerForNewsletter: this.registerForNewsletter,
  });

  public availableSchools = [
    'ETH Zürich',
    'UZH'
  ]

  constructor(private httpClient: HttpClient, private playerService: PlayerService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const newPlayer = new PlayerScore({
      name: this.profileForm.value.name as string,
      email: this.profileForm.value.email as string,
      school: this.profileForm.value.school as string,
      hasNewsletter: this.profileForm.value.registerForNewsletter as boolean,
    })

    if (this.playerService.CurrentPlayer.id == undefined) {
      this.httpClient.post<PlayerScore>(`${environment.baseURL}PlayerScore`, newPlayer).subscribe(p => this.onPlayerRegistered(p));
    } else {
      this.router.navigate(['game']);
    }
  }

  private onPlayerRegistered(player: PlayerScore) {
    this.playerService.CurrentPlayer = player;
    this.router.navigate(['game']);
  }

}
