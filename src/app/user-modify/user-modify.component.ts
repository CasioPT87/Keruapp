import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
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
    private _router: Router
  ) { 
    this.authorised = false;
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userService.getCurrentUser()
      .subscribe((user) => { 
        this.error = user.error || null;
        if (!this.error) {
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
        this.userPhotoFile = user.photo;
        this.authorised = true;
        }
      });
  }

  //set photo selected
  setPhotoFile(fileData) {
    if (fileData.target.files && fileData.target.files[0]) {
      this.userPhotoFile = fileData.target.files[0];
      
      this.getOrientation(this.userPhotoFile)
        .then((returnFunction) => {
          console.log(returnFunction)
          var orientation = returnFunction[0];
          console.log(orientation)
          var srcBase64 = returnFunction[1];
          return this.resetOrientation(srcBase64, orientation);  
        })
        .then((resetBase64Image) => {
          this.model.imageURL = resetBase64Image;
        })
      
      
    //   var reader = new FileReader();
    //   reader.onload = (event: any) => {
    //     this.model.imageURL = event.target.result;
    //   }
    //   reader.readAsDataURL(fileData.target.files[0]);
    // } else {
    //   console.log('problem setting the photo selected')
    // }
    }
  }

  getOrientation(file) {

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
  
      reader.onload = (event: any) => {
        var srcBase64 = event.target.result;
        var view = new DataView(srcBase64);
    
        if (view.getUint16(0, false) != 0xFFD8){
          console.log('1')
          resolve( [-2, srcBase64] );
        } 
        var length = view.byteLength,
            offset = 2;
    
        while (offset < length) {
          var marker = view.getUint16(offset, false);
          offset += 2;
    
          if (marker == 0xFFE1) {
            if (view.getUint32(offset += 2, false) != 0x45786966) {
              console.log('2')
              resolve( [-1, srcBase64] );
            }
            var little = view.getUint16(offset += 6, false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            var tags = view.getUint16(offset, little);
            offset += 2;
    
            for (var i = 0; i < tags; i++)
              if (view.getUint16(offset + (i * 12), little) == 0x0112){
                console.log('3')
                resolve( [view.getUint16(offset + (i * 12) + 8, little), srcBase64] );
              }           
          }
          else if ((marker & 0xFF00) != 0xFF00) {
            console.log('4')
            break;
          }
          else {
            console.log('5')
            offset += view.getUint16(offset, false);
          }
        }
        console.log('6')
        resolve( [-1, srcBase64] );
      };
      console.log('7')
      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    })
    
  };
  

  resetOrientation(srcBase64, srcOrientation) {
    var img = new Image();	
  
    img.onload = function() {
      var width = img.width,
          height = img.height,
          canvas = document.createElement('canvas'),
          ctx = canvas.getContext("2d");
      
      // set proper canvas dimensions before transform & export
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
    
      // transform context before drawing image
      switch (srcOrientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height , width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }
  
      // draw image
      ctx.drawImage(img, 0, 0);
  
      // export base64
      return canvas.toDataURL();
    };
  
    img.src = srcBase64;
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
