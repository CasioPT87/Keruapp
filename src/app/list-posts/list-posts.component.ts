
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { MapService } from '../map.service';
import { UserService } from '../user.service';

@Component({
  selector: 'list-posts-map',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})

export class ListPostsComponent implements OnInit {  
  @ViewChild('gmapListPosts') gmapElement: any;
  map: google.maps.Map;
  
  authorised: boolean;
  username: string;
  errorLoadingPosts: boolean = false;
  
  latitude: any;
  longitude: any;
  locationName: string;
  listPosts: object[];
  mapHidden: boolean;
  //browserLang: String;

  firstSearchNotDoneYet: boolean = true;

  constructor(
    private mapService: MapService,
    private userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.mapHidden = true;
    this.spinnerService.show();
   }

  ngOnInit() {
    this.listPosts = null;
    this.latitude = 18.5793;
    this.longitude = 73.8143;
    var mapProp = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    //this.browserLang = navigator.language;
    this.checkAuthorization()
  }

  checkAuthorization(): any {    
    alert('check auth aki tron!!')
    this.userService.checkAuthorization()
      .subscribe((authorisedObj) => {
        this.authorised = authorisedObj.authorised;
        if (this.authorised) {          
          this.getUsername();
        } else if (!this.authorised) {
          this.lastestsPosts();
        }
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

  closestPosts(): void {
    var locationName = this.locationName;
    this.mapService.getClosestPosts(locationName)
      .subscribe((response) => {
        this.listPosts = response.posts; 
        this.latitude = response.searchLocation.latitude;
        this.longitude = response.searchLocation.longitude;
        this.errorLoadingPosts = response.errorLoadingPosts;
        if (!this.errorLoadingPosts) this.firstSearchNotDoneYet = false;
        this.errorLoadingPosts = response.errorLoadingPosts;
        this.setCenter();
        this.mapHidden = false;
      });
  }

  lastestsPosts(): void {
    this.mapService.getLastestsPosts()
      .subscribe((responseListPosts) => {
        console.log(responseListPosts)
        this.errorLoadingPosts = responseListPosts.errorLoadingPosts;
        if (!responseListPosts.errorLoadingPosts) {
          this.listPosts = responseListPosts.posts;
          this.spinnerService.hide();
        } else {
          this.spinnerService.hide();
        }       
      });
  }

  getUsername() {
    this.userService.getCurrentUserName()
      .subscribe((currentUser) => {  
        if (currentUser) {
          this.username = currentUser.username;
          this.lastestsPosts();   
        }
        else {
          this.authorised = false;
          this.lastestsPosts();   
        }
        
      });
  }

}