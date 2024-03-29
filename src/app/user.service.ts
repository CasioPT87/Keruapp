

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user';

const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
  withCredentials: true
}

const httpOptionsHtml = {
  headers: new HttpHeaders().set('Content-Type', 'text/html'),
  withCredentials: true
}

var production = true;

if (!production) {
  var path = 'http://localhost:3000';
} else {
  var path = ''
}

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(name): Observable<any> {
    var response =  this.http.get(path + '/users/getuser/'+name, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  getCurrentUser(): Observable<any> {
    var response =  this.http.get(path + '/users/currentuser', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  getCurrentUserName(): Observable<any> {
    var response =  this.http.get(path + '/users/currentusername', httpOptions);
    return response;
  }

  getSignedRequestPhoto(file): Observable<any> {
    var response =  this.http.get(path + `/file/sign-s3?file-name=${file.name}&file-type=${file.type}`, {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  uploadUserPhoto (file, signedRequest): Observable<any> {
    var response = this.http.put<any>(signedRequest.signedRequest, file);
    return response;
  }

  createUser (user): Observable<any> {
    return this.http.post<User>(path + '/auth/createuser/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  updateUser (user): Observable<any> {
    return this.http.put<User>(path + '/users/update/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  login (user): Observable<any> {
    return this.http.post<User>(path + '/auth/login/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  googleLogin (): Observable<any> {
    var response =  this.http.get(path + '/auth/google', httpOptionsHtml);
    return response;
  }

  logout (): Observable<any> {
    var response =  this.http.get(path + '/auth/logout', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  checkAuthorization (): Observable<any> {
    var response =  this.http.get(path + '/auth/checkauth', httpOptions);
    return response;
  }
  
}
