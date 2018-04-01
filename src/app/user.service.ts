

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user';

const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
  withCredentials: true
}


@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(name): Observable<any> {
    var response =  this.http.get('/users/'+name, {
      withCredentials: true  // <=========== important!
    });
    console.log(response)
    return response;
  }

  createUser (user): Observable<User> {
    return this.http.post<User>('/auth/createuser/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  login (user): Observable<any> {
    return this.http.post<User>('/auth/login/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  googleLogin (): Observable<any> {
    var response =  this.http.get('/auth/google', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  logout (): Observable<any> {
    var response =  this.http.get('/auth/logout', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  checkAuthorization (): Observable<any> {
    var response =  this.http.get('/auth/checkauth', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }
  
}
