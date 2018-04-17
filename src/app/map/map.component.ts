
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ImageService } from '../image.service';

import { MapService } from '../map.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {  
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  authorised: boolean;
  error: any;
  mapShown: boolean;

  latitude: any;
  longitude: any;
  locationName: string;

  user: string;
  title: string;
  description: string;
  codeCountry: string;
  formatedAddress: string;
  likes: number;
  url: string;
  comments: string[];
  dateCreated: Date;
  dateModified: Date;

  signedRequest: any;
  userPhotoFile: any;
  imageURL: string;
  imageURLToDisplay: string;

  constructor(
    private mapService: MapService,
    private userService: UserService,
    private _router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private imageService: ImageService
  ) { 
    this.mapShown = false;
  }

  ngOnInit() {  
    this.spinnerService.show()  
    this.checkAuthorization()
  }

  checkAuthorization() {
    this.userService.checkAuthorization()
      .subscribe((authorised) => {        
        this.authorised = authorised;
        this.error = false;
        this.spinnerService.hide();
      });
  }

  setCenter() {
    var mapProp = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.latitude, this.longitude),
      map: this.map,
      title: 'Tu posicion!!'
    });
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.mapShown = true;
  }

  getCoordinates(): void {
    var locationName = this.locationName;
    this.mapService.getCoordinates(locationName)
      .subscribe((coord) => {
        if (coord) {
          this.latitude = coord.lat;
          this.longitude = coord.lng;
          this.codeCountry = coord.codeCountry;
          this.formatedAddress = coord.formatedAddress;
          this.setCenter();
        } else {
          this.error = 'Parece que hay problemas de conexion'
        }    
        
      });
  }

  //set photo selected
  setPhotoFile(fileData) {
    if (fileData.target.files && fileData.target.files[0]) {
      console.log(-1)
      this.userPhotoFile = fileData.target.files[0];
      // var nameFile = this.userPhotoFile.name;
      // var typeFile = this.userPhotoFile.type;
      //  // this is for rotate correctly the image. it can go wrong if it's done with the camero of a mobile
      //   var reader = new FileReader();
      //   reader.onload = (event: any) => {
      //     console.log(0)
      //     var originalImage = event.target.result;              
      //     this.imageURLToDisplay = originalImage
      //     this.imageService.fixImageRotationInput(fileData)
      //       .then((resetBase64Image) => {
      //         console.log(1)
      //         this.imageURLToDisplay = resetBase64Image;
      //         new Promise((resolve, reject) => {
      //           var photoFile = this.imageService.base64toFile(resetBase64Image, nameFile, typeFile);
      //           console.log(2)
      //           console.log(photoFile)
      //           if (photoFile) resolve(photoFile);
      //           else reject();
      //         })
      //           .then((photoFile) => {
      //             console.log(3)
      //             console.log(photoFile)
      //             this.userPhotoFile = photoFile;
      //           })
      //       }) 
      //       .catch((err) => {
      //         console.log('error cargando o modificando rotacion de la imagen: '+err);
      //         this.imageURLToDisplay = '';
      //       }) 
      //   }
      //   reader.readAsDataURL(fileData.target.files[0]);     
    }
  }
  
  //get the signed request
  getSignedRequestPhoto() {
    var userPhotoFile = this.userPhotoFile;
    this.userService.getSignedRequestPhoto(userPhotoFile)
      .subscribe((signedRequest) => {
        this.signedRequest = JSON.parse(signedRequest);
        this.imageURL = this.signedRequest.url;
        this.uploadUserPhoto()
      });
  }

  uploadUserPhoto() {
    var file = this.userPhotoFile;
    var signedRequest = this.signedRequest;
    return this.userService.uploadUserPhoto(file, signedRequest)
      .subscribe((response) => {
        if (response === null) this.createPost();
        else {
          var error = new Error(`error: ${response}`);
          console.log(error)
        }    
      });
  }
  

  createPost(): any {
    var post = {
      title: this.title,
      description: this.description,
      url: this.url,
      latitude: this.latitude,
      longitude: this.longitude,
      codeCountry: this.codeCountry,
      formatedAddress: this.formatedAddress,
      imageURL: this.imageURL
    }
    this.mapService.createPost(post)
      .subscribe((response) => {
        this.error =  response.error;
        if (!this.error) this._router.navigate(['']);
      });     
  }
}
 