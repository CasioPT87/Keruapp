
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions ={
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
  withCredentials: true
}

var production = false;

if (!production) {
  var path = 'http://localhost:3000';
} else {
  var path = ''
}

@Injectable()
export class MapService {

  constructor(private http: HttpClient) { }

  getCoordinates(location): Observable<any> {
    var response =  this.http.get(path + '/map/'+location, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  createPost (post): Observable<any> {
    return this.http.post<any>(path + '/post/createpost/', post, httpOptions);
  }

  getPost(postNumber): Observable<any> {
    var response =  this.http.get(path + '/post/findpost/'+postNumber, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  getClosestPosts(location): Observable<any> {
    var response =  this.http.get(path + '/post/findposts/'+location, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  getLastestsPosts(): Observable<any> {
    var response =  this.http.get(path + '/post/findlastsposts/', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  addComment (comment): Observable<any> {
    return this.http.post<any>(path + '/comment/addcomment/', comment, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  likePost (postNumber): Observable<any> {
    return this.http.put<any>(path + '/post/likePost/', postNumber, {
      headers: new HttpHeaders(),
      withCredentials: true
    });
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }
  
}