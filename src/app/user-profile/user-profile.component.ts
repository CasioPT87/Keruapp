

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
//import 'rxjs/add/operator/map';

import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  authorised: Object;
  error: boolean;

  username: any;
  dateCreated: Date;
  description: string;
  url: string;
  likes: number;
  imageURL: string;
  posts: any[];
  ownProfile: boolean;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.error = true;
    this.ownProfile = false;
   }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    var nameObj;
    this.route.params.subscribe(name => nameObj = name);
    var name = nameObj.name;
    //var name = this.route.snapshot.params.name;
    this.userService.getUser(name)
      .subscribe((dataUserResponse) => {
        console.log(dataUserResponse)
        this.error = dataUserResponse.error;
        this.username= dataUserResponse.user.username;
        this.dateCreated =  dataUserResponse.user.dateCreated;
        this.description = dataUserResponse.user.description;
        this.url = dataUserResponse.user.url;
        this.likes = dataUserResponse.likes;
        this.imageURL = dataUserResponse.user.imageURL;
        this.ownProfile = dataUserResponse.user.ownProfile;
        this.authorised = dataUserResponse.authorised || false;
        this.posts = dataUserResponse.posts || null;
      });
  }

  refresh() {
    window.location.reload();
  }

  toLink() {
    console.log(this.url.toString())
    window.location.href = this.url;
  }

}
