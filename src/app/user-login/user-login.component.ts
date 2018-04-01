


import { Component, OnInit} from '@angular/core';

import { UserService } from '../user.service';

import { User }    from '../user';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  authorised: boolean;
  error: boolean = false;

  username: any;
  password: any;

  constructor(
    private userService: UserService
  ) { }

  submitted = false;

  ngOnInit() {
    this.checkAuthorization();
  }

  checkAuthorization() {
    this.userService.checkAuthorization()
      .subscribe((authorised) => {
        console.log(authorised)
        this.authorised = authorised;
      });
  }

  onSubmit() {     
    console.log('submitting stuff')
  }

  login(): void {
    var user = {
      username: this.username,
      password: this.password
    };
    this.userService.login(user)
      .subscribe((response) => {
        console.log(response)
        this.authorised = response.authorised;
        this.error = response.error;
      });
  }

  googleLogin(): void {
    this.userService.googleLogin()
      .subscribe(authorised => this.authorised = authorised);
  }

  logout(): void {
    this.userService.logout()
      .subscribe(authorised => this.authorised = authorised); // authorised will always be false
  }

}
