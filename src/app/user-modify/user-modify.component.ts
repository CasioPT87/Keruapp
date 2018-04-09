import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

import { User }    from '../user';

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent {

  model: any = {
    userName: "",
    password: "",
    dateCreated: Date,
    dateModified: Date,
    description: "",
    url: "",
    likes: 0,
    favoritePosts: [],
    imageURL: ""
  };
  error: boolean = false;
  submitted: boolean = false;
  signedRequest: any;
  userPhotoFile: any = null;

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
          imageURL: user.imageURL || ""
        };
        this.error = user.error || null;
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
      // this.getSignedRequestPhoto()
    } else {
      console.log('problem setting the photo selected')
    }
  }
  
  //get the signed request
  getSignedRequestPhoto() {
    var userPhotoFile = this.userPhotoFile;
    this.userService.getSignedRequestPhoto(userPhotoFile)
      .subscribe((signedRequest) => {
        this.signedRequest = JSON.parse(signedRequest);
        this.model.imageURL = this.signedRequest.url;
        console.log(this.signedRequest)
        //now we have the signed request. Let's upload this shit
        this.uploadUserPhoto()
      });
  }

  sendUserUpdate() {
    console.log(this.model)
    if (this.userPhotoFile) {
      this.getSignedRequestPhoto();
    } else {
      this.updateUser();
    }
  }

  uploadUserPhoto() {
    var file = this.userPhotoFile;
    var signedRequest = this.signedRequest;
    return this.userService.uploadUserPhoto(file, signedRequest)
      .subscribe((response) => {
        console.log(response)
        if (response === null) this.updateUser();
        else {
          var error = new Error(`error: ${response}`);
          console.log(error)
        }    
      });
  }

  updateUser(): void {
    var user = this.model;
    console.log('updateUser')
    console.log(this.model.imageURL)
    this.userService.updateUser(user)
      .subscribe(response => this.error = response.error);
  }
}
