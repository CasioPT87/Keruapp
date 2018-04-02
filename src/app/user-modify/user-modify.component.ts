import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

import { User }    from '../user';

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent {

  model: object = {
    userName: "",
    password: "",
    dateCreated: Date,
    dateModified: Date,
    description: "",
    url: "",
    likes: 0,
    favoritePosts: [],
  };
  error: boolean = false;
  submitted: boolean = false;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userService.getCurrentUser()
      .subscribe((user) => { 

        this.model = {
          userName: user.username || "",
          dateCreated: user.dateCreated || null,
          dateModified: user.dateModified || null,
          description: user.description || "",
          url: user.url || null,
          likes: user.likes,
          favoritePosts: user.favoritePosts || [],
        };
        this.error = user.error || false
      });
  }

  // newUser() {
  //   return new User('User name', "", new Date(), new Date());
  // }

  onSubmit() {     
     this.submitted = true;
  }

  updateUser(): void {
    var user = this.model;
    this.userService.updateUser(user)
      .subscribe(response => this.error = response.error);
  }
}
