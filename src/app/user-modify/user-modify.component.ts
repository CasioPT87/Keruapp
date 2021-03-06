import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

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
    imageURL: ""
  };
  error: any;
  signedRequest: any;
  userPhotoFile: any;
  authorised: boolean;
  methodIdent: any;
  imageURL: any;

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private _router: Router,
    private spinnerService: Ng4LoadingSpinnerService
  ) {     
    this.userPhotoFile = null;
  }

  ngOnInit() {
    this.spinnerService.show();
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userService.getCurrentUser()
      .subscribe((objUserResponse) => { 
        this.error = objUserResponse.error;
        if (!this.error) {
          this.model = {
            userName: objUserResponse.username || "",
            dateCreated: objUserResponse.dateCreated || null,
            dateModified: objUserResponse.dateModified || null,
            description: objUserResponse.description || "",
            url: objUserResponse.url || null,
            likes: objUserResponse.likes,          
          };
          this.authorised = objUserResponse.authorised;
          this.methodIdent = objUserResponse.methodIdent;
          console.log(this.methodIdent)
          this.imageURL = objUserResponse.imageURL;  
          this.spinnerService.hide();         
        } else {
          this.spinnerService.hide(); 
        }
      })          
  }

  // rotateImage(imageURL) {
  //   setTimeout(() => {
  //     if (imageURL) {
  //       this.imageService.getImage(imageURL)
  //         .subscribe((fileDataBlob) => {            
  //           var reader = new FileReader();
  //           this.imageService.fixImageRotationURL(reader, fileDataBlob)
  //             .then((resetBase64Image) => {
  //               this.imageURL = resetBase64Image;       
  //             }) 
  //             .catch((err) => {
  //               console.log('error cargando o modificando rotacion de la imagen: '+err); 
  //               this.imageURL = null;               
  //             })
  //         });
  //     } else {
  //       this.imageURL = null; 
  //     }
  //   }, 0);       
  // }

  //set photo selected
  setPhotoFile(fileData) {
    if (fileData.target.files && fileData.target.files[0]) {
      this.spinnerService.show();
      this.userPhotoFile = fileData.target.files[0];
      var nameFile = this.userPhotoFile.name;
      var typeFile = this.userPhotoFile.type;
       // this is for rotate correctly the image. it can go wrong if it's done with the camero of a mobile
        var reader = new FileReader();
        reader.onload = (event: any) => {
          var originalImage = event.target.result;              
          this.imageURL = originalImage
          this.imageService.fixImageRotationInput(fileData)
            .then((resetBase64Image) => {
              this.imageURL = resetBase64Image;
              new Promise((resolve, reject) => {
                var photoFile = this.imageService.base64toFile(resetBase64Image, nameFile, typeFile);
                if (photoFile) resolve(photoFile);
                else reject();
              })
                .then((photoFile) => {
                  this.userPhotoFile = photoFile;
                  this.spinnerService.hide();
                })
            }) 
            .catch((err) => {
              console.log('error cargando o modificando rotacion de la imagen: '+err);
              this.imageURL = null;
              this.error = "Ha habido un error. La imagen parece no ser valida."
              this.spinnerService.hide(); 
            }) 
        }
        reader.readAsDataURL(fileData.target.files[0]);     
    }
  }

  //get the signed request
  getSignedRequestPhoto() {
    var userPhotoFile = this.userPhotoFile;
    this.userService.getSignedRequestPhoto(userPhotoFile)
      .subscribe((signedRequest) => {
        if (signedRequest) {
          this.signedRequest = JSON.parse(signedRequest);
          this.model.imageURL = this.signedRequest.url;
          //now we have the signed request. Let's upload this shit
          this.uploadUserPhoto()
        } else {
          this.error = "Parece que hay un problema con la conexion a internet";
          this.spinnerService.hide();
        }
        
      });
  }

  uploadUserPhoto() {
    var file = this.userPhotoFile;
    var signedRequest = this.signedRequest;
    return this.userService.uploadUserPhoto(file, signedRequest)
      .subscribe((response) => {
        if (response === null) this.updateUser();
        else {
          this.error = "Parece que hay un problema con la conexion a internet";
          this.spinnerService.hide();
        }    
      });
  }

  sendUserUpdate() {
    this.spinnerService.show();
    if (this.userPhotoFile) {
      //osea, si hemos cambiado la foto
      this.getSignedRequestPhoto();
    } else {
      //osea, si no hemos cambiado la foto
      this.updateUser();
    }
  }

  updateUser(): void {
    var user = this.model;
    this.userService.updateUser(user)
      .subscribe((response) => {        
        this.error = response.error;
        if (!response.error)this._router.navigate(['/user/'+this.model.userName+'']);
        else this.spinnerService.hide();
      });
  }
  
}
