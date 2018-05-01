import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { UserService } from '../user.service';
import { User }    from '../user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {

  authorised: boolean;

  username: string;
  password: string;
  dateCreated: Date;
  dateModified: Date;
  description: string;
  url: string;
  likes: Number;
  posts: string[];
  favoriteUsers: string[];
  favoritePosts: string[];

  constructor(
    private userService: UserService,
    private _router: Router,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  model = this.newUser();

  ngOnInit() {
    this.checkAuthorization();
  }

  checkAuthorization() {
    this.userService.checkAuthorization()
      .subscribe((authorisedObj) => {       
        this.authorised = authorisedObj.authorised;
        if (this.authorised) {
          this.getUsername();
        }
      });
  }

  getUsername() {
    this.userService.getCurrentUser()
      .subscribe((currentUser) => {      
        this.model.username = currentUser.username;
      });
  }

  newUser() {
    return new User('', "", new Date(), new Date());
  }

  createUser(): void {
    this.spinnerService.show();
    var user = this.model;
    this.userService.createUser(user)
      .subscribe((response) => {
        if (!response.error) this._router.navigate(['']);
        else this.spinnerService.hide();
      });
  }

}
