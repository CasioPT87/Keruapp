

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/map';

import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: Object;
  authorised: Object;
  posts: any[];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

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
        this.user = dataUserResponse.user || null;
        this.authorised = dataUserResponse.authorised || false;
        this.posts = dataUserResponse.posts || null;
      });
  }

}
