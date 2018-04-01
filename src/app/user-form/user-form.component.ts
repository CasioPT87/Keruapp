import { Component, OnInit } from '@angular/core';

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
    private userService: UserService
  ) { }

  model = this.newUser();

  submitted = false;

  ngOnInit() {
    this.checkAuthorization();
  }

  checkAuthorization() {
    this.userService.checkAuthorization()
      .subscribe((authorised) => {       
        this.authorised = authorised;
      });
  }

  newUser() {
    return new User('User name', "", new Date(), new Date());
  }

  onSubmit() {     
     this.submitted = true;
  }

  createUser(): void {
    var user = this.model;
    this.userService.createUser(user)
      .subscribe(user => console.log(user));
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
