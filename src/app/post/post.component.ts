
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivatedRoute } from '@angular/router';

import { MapService } from '../map.service';
import { UserService } from '../user.service';

@Component({
  selector: 'post-map',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit {  
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  latitude: any;
  longitude: any;
  post: object;
  valueComment: any;
  postNumber: any;
  comments: any[];
  postLiked: boolean = false;
  numLikesInPost: number = 0;
  imageURL: string;
  codeCountry: string = 'pollas';
  formatedAddress: string;
  mapShown: boolean;
  error: any;
  authorised: boolean;
  url: string;

  constructor(
    private route: ActivatedRoute,
    private mapService: MapService,
    private userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.mapShown = false;
   }

  ngOnInit() {
    this.spinnerService.show();
    this.postNumber = +this.route.snapshot.paramMap.get('postNumber');
    this.mapService.getPost(this.postNumber)
      .subscribe((responsePost) => {  
        this.error = responsePost.error; 
        if (!this.error) {
          console.log(responsePost)
          var post = responsePost.post;
          this.post = post;
          this.postLiked = responsePost.like;
          this.numLikesInPost = responsePost.numLikesInPost;
          this.longitude = post.location[0];
          this.latitude = post.location[1];
          this.imageURL = post.imageURL;
          this.url = post.url;
          this.codeCountry = post.codeCountry;
          this.formatedAddress = post.formatedAddress;
          this.comments = responsePost.comments;
          this.checkAuthorization()
          this.spinnerService.hide();
          // var mapProp = {
          //   center: new google.maps.LatLng(this.latitude, this.longitude),
          //   zoom: 15,
          //   mapTypeId: google.maps.MapTypeId.ROADMAP
          // };
          // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        } else {
          this.error = "No hemos podido recuperar el post. Por favor asegurate de tener conexion.";
        }      
      });
  }

  checkAuthorization(): any {    
    this.userService.checkAuthorization()
      .subscribe((authorisedObj) => {
        this.authorised = authorisedObj.authorised;
      });
  }

  toggleMap() {
    if (!this.mapShown) {
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
    } else {
      this.mapShown = false;
    }    
  }

  addComment(): void {
    var data = {
      comment: this.valueComment,
      postNumber: this.postNumber
    }
    this.mapService.addComment(data)
      .subscribe((comments) => {
        if (comments) {         
          this.valueComment = null;
          this.comments = comments;
        } else {
          console.log('problema recuperando los comments');
        }      
      });
  }

  likePost(postNumberObj): void {
    postNumberObj.postNumber = this.postNumber;
    this.mapService.likePost(postNumberObj)
      .subscribe((response) => {
        this.postLiked = response.likePost; 
        this.numLikesInPost = response.numLikesInPost   ;   
      });
  }

  toLink() {
    window.location.href = 'https://'+this.url;
  }
}

