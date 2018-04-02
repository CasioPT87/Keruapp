
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions ={
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
  withCredentials: true
}

@Injectable()
export class MapService {

  constructor(private http: HttpClient) { }

  getCoordinates(location): Observable<any> {
    var response =  this.http.get('/map/'+location, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  createPost (post): Observable<any> {
    return this.http.post<any>('/post/createpost/', post, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  getPost(postNumber): Observable<any> {
    var response =  this.http.get('/post/findpost/'+postNumber, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  getClosestPosts(location): Observable<any> {
    var response =  this.http.get('/post/findposts/'+location, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  addComment (comment): Observable<any> {
    return this.http.post<any>('/comment/addcomment/', comment, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  likePost (postNumber): Observable<any> {
    return this.http.put<any>('/post/likePost/', postNumber, {
      headers: new HttpHeaders(),
      withCredentials: true
    });
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }
  
}