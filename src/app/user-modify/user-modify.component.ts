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
    favoritePosts: []
  };
  error: boolean = false;
  submitted: boolean = false;
  signedRequest: any;
  userPhotoFile: any;

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
          favoritePosts: user.favoritePosts || []
        };
        this.error = user.error || false;
        this.userPhotoFile = user.photo;
      });
  }

  onSubmit() {     
     this.submitted = true;
  }

  //set photo selected
  setPhotoFile(fileData) {
    if (fileData.target.files && fileData.target.files[0]) {
      this.userPhotoFile = fileData.target.files[0];
      //now we get the signed request
      this.getSignedRequestPhoto()
    } else {
      console.log('problem setting the photo selected')
    }
  }
  
  //get the signed request
  getSignedRequestPhoto() {
    var userPhotoFile = this.userPhotoFile;
    console.log(userPhotoFile)
    this.userService.getSignedRequestPhoto(userPhotoFile)
      .subscribe((signedRequest) => {
        console.log(signedRequest)
        this.signedRequest = JSON.parse(signedRequest);
        console.log(this.signedRequest)
        //now we have the signed request. Let's upload this shit
        this.uploadUserPhoto();
      });
  }

  uploadUserPhoto() {
    var file = this.userPhotoFile;
    var signedRequest = this.signedRequest;
    console.log(signedRequest)
    console.log(signedRequest.url)
    console.log(signedRequest.signedRequest)
    this.userService.uploadUserPhoto(file, signedRequest)
      .subscribe((signedRequest) => {
        console.log('a ver si la hemos subido bien...')
      });
  }

  updateUser(): void {
    var user = this.model;
    this.userService.updateUser(user)
      .subscribe(response => this.error = response.error);
  }
}
