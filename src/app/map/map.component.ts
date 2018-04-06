
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

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
  error: boolean = false;

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

  constructor(
    private mapService: MapService,
    private userService: UserService
  ) { }

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.checkAuthorization()
  }

  checkAuthorization() {
    this.userService.checkAuthorization()
      .subscribe((authorised) => {
        console.log(authorised)
        this.authorised = authorised;
      });
  }

  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    let location = new google.maps.LatLng(this.latitude, this.longitude);
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'Your position!!'
    });
  }

  getCoordinates(): void {
    var locationName = this.locationName;
    this.mapService.getCoordinates(locationName)
      .subscribe((coord) => {
        this.latitude = coord.lat;
        this.longitude = coord.lng;
        this.codeCountry = coord.codeCountry;
        this.formatedAddress = coord.formatedAddress;
        this.setCenter();
      });
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
    this.userService.getSignedRequestPhoto(userPhotoFile)
      .subscribe((signedRequest) => {
        this.signedRequest = JSON.parse(signedRequest);
        this.imageURL = this.signedRequest.url;
        console.log(this.signedRequest)
        console.log(this.imageURL)
        //now we have the signed request. Let's upload this shit
        //this.uploadUserPhoto()
      });
  }

  uploadUserPhoto() {
    var file = this.userPhotoFile;
    var signedRequest = this.signedRequest;
    return this.userService.uploadUserPhoto(file, signedRequest)
      .subscribe((response) => {
        console.log(response)
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
    // new Promise((resolve, reject) => {
    //   var responseUploadPhoto = this.uploadUserPhoto();
    //   if (responseUploadPhoto) resolve(responseUploadPhoto);
    //   else reject(new Error('Problema subiendo la foto'))
    // })  
    //   .then((responseUploadPhoto) => {
    this.mapService.createPost(post)
      .subscribe((response) => {
        this.error =  response.error;
      });   
      // }) 
      // .catch((error) => {
      //   console.log(error);
      // })    
  }

  onSubmit(): void {
  }
}
 