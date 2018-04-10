
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

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
  error: boolean = false;

  latitude: any;
  longitude: any;
  locationName: string;
  listPosts: object[];
  mapHidden: boolean;

  firstSearchNotDoneYet: boolean = true;

  constructor(
    private mapService: MapService,
    private userService: UserService
  ) {
    this.mapHidden = true;
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
    this.checkAuthorization()
    this.lastestsPosts();
  }

  checkAuthorization(): any {
    console.log('checkAuthorization')
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

  closestPosts(): void {
    var locationName = this.locationName;
    this.mapService.getClosestPosts(locationName)
      .subscribe((response) => {
        console.log(response)
        this.listPosts = response.posts; 
        this.latitude = response.searchLocation.latitude;
        this.longitude = response.searchLocation.longitude;
        this.error = response.error;
        if (!this.error) this.firstSearchNotDoneYet = false;
        this.setCenter();
        this.mapHidden = false;
      });
  }

  lastestsPosts(): void {
    this.mapService.getLastestsPosts()
      .subscribe((response) => {
        this.listPosts = response.posts; 
        this.error = response.error;
      });
  }

  onSubmit(): void {
  }
}