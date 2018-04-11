


import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

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
    private userService: UserService,
    private _router: Router
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
        if (!this.error) {
          this._router.navigate(['']);
        }
      });
  }

  googleLogin(): void {
    this.userService.googleLogin()
      .subscribe(authorised => this.authorised = authorised);
  }

  logout(): void {
    this.userService.logout()
      .subscribe((authorised) => {
        this.authorised = authorised; // authorised will always be false
      });
  }

}
