import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { ImageService } from '../image.service';
import { User }    from '../user';
import { reject } from 'q';

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
  signedRequest: any;
  userPhotoFile: any = null;
  authorised: boolean;

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private _router: Router
  ) { 
    this.authorised = false;
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userService.getCurrentUser()
      .subscribe((objUserResponse) => { 
        this.error = objUserResponse.error || null;
        if (!this.error) {
          this.model = {
            userName: objUserResponse.username || "",
            dateCreated: objUserResponse.dateCreated || null,
            dateModified: objUserResponse.dateModified || null,
            description: objUserResponse.description || "",
            url: objUserResponse.url || null,
            likes: objUserResponse.likes,
            favoritePosts: objUserResponse.favoritePosts || []           
          };
          this.authorised = objUserResponse.authorised;
          // this is for rotate correctly the image. it can go wrong if it's done with the camero of a mobile
          var imageURL = objUserResponse.imageURL;
          this.model.imageURL = imageURL;   
          this.rotateImage(imageURL)     
        }
      })          
  }

  rotateImage(imageURL) {
    setTimeout(() => {
      if (imageURL) {
        this.imageService.getImage(imageURL)
          .subscribe((fileDataBlob) => {            
            var reader = new FileReader();
            this.imageService.fixImageRotationURL(reader, fileDataBlob)
              .then((resetBase64Image) => {
                this.model.imageURL = resetBase64Image;       
              }) 
              .catch((err) => {
                console.log('error cargando o modificando rotacion de la imagen: '+err); 
                this.model.imageURL = null;               
              })
          });
      } else {
        this.model.imageURL = null; 
      }
    }, 0);       
  }

  //set photo selected
  setPhotoFile(fileData) {
    if (fileData.target.files && fileData.target.files[0]) {
      this.userPhotoFile = fileData.target.files[0];
       // this is for rotate correctly the image. it can go wrong if it's done with the camero of a mobile
      
      this.imageService.fixImageRotationInput(fileData)
        .then((resetBase64Image) => {
          this.model.imageURL = resetBase64Image;
        }) 
        .catch((err) => {
          console.log('error cargando o modificando rotacion de la imagen: '+err);
          this.model.imageURL = '';
        })    
    }
  }

  //get the signed request
  getSignedRequestPhoto() {
    var userPhotoFile = this.userPhotoFile;
    this.userService.getSignedRequestPhoto(userPhotoFile)
      .subscribe((signedRequest) => {
        this.signedRequest = JSON.parse(signedRequest);
        this.model.imageURL = this.signedRequest.url;
        //now we have the signed request. Let's upload this shit
        this.uploadUserPhoto()
      });
  }

  uploadUserPhoto() {
    var file = this.userPhotoFile;
    var signedRequest = this.signedRequest;
    return this.userService.uploadUserPhoto(file, signedRequest)
      .subscribe((response) => {
        if (response === null) this.updateUser();
        else {
          var error = new Error(`error: ${response}`);
        }    
      });
  }

  sendUserUpdate() {
    if (this.userPhotoFile) {
      this.getSignedRequestPhoto();
    } else {
      this.updateUser();
    }
  }

  updateUser(): void {
    var user = this.model;
    this.userService.updateUser(user)
      .subscribe((response) => {
        this.error = response.error;
        if (!response.error)this._router.navigate(['/user/'+this.model.userName+'']);
      });
  }
  
}
