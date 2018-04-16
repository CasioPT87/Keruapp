


import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

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
    private _router: Router,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  submitted = false;

  ngOnInit() {
    this.checkAuthorization();
    this.spinnerService.show();
  }

  checkAuthorization() {
    this.userService.checkAuthorization()
      .subscribe((authorised) => {
        this.authorised = authorised;
        this.spinnerService.hide();
      });
  }

  login(): void {
    this.spinnerService.show();
    var user = {
      username: this.username,
      password: this.password
    };
    this.userService.login(user)
      .subscribe((response) => {
        this.authorised = response.authorised;
        this.error = response.error;
        if (!this.error) {
          this._router.navigate(['']);
        } else {
          this.spinnerService.hide();
        }
      });
  }

  googleLogin(): void {
    this.spinnerService.hide();
    this.userService.googleLogin()
      .subscribe((authorised) => {
        console.log(authorised)
        this.authorised = authorised; 
        this.spinnerService.hide();
        // aqui hay que manejar el error. no se ha hecho nada para eso aun
      });
  }

  logout(): void {
    this.spinnerService.show();
    this.userService.logout()
      .subscribe((authorised) => {
        this.spinnerService.hide();
        this.authorised = authorised; // authorised will always be false
      });
  }

}
