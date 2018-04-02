
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
    var response =  this.http.get('http://localhost:3000/map/'+location, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  createPost (post): Observable<any> {
    return this.http.post<any>('http://localhost:3000/post/createpost/', post, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  getPost(postNumber): Observable<any> {
    var response =  this.http.get('http://localhost:3000/post/findpost/'+postNumber, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  getClosestPosts(location): Observable<any> {
    var response =  this.http.get('http://localhost:3000/post/findposts/'+location, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  addComment (comment): Observable<any> {
    return this.http.post<any>('http://localhost:3000/comment/addcomment/', comment, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  likePost (postNumber): Observable<any> {
    return this.http.put<any>('http://localhost:3000/post/likePost/', postNumber, {
      headers: new HttpHeaders(),
      withCredentials: true
    });
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }
  
}