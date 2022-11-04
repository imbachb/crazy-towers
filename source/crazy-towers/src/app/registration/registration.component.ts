import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  highschool = new FormControl('', [Validators.required]);
  registerForNewsletter = new FormControl(false);

  profileForm = new FormGroup({
    name: this.name,
    email: this.email,
    highschool: this.highschool,
    registerForNewsletter: this.registerForNewsletter,
  });

  public availableHighschools = [
    'ETH Zürich',
    'UZH'
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // TODO: Registration on backend
    console.warn(this.profileForm.value);
  }

}
