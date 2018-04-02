

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
    var response =  this.http.get('http://localhost:3000/users/getuser/'+name, {
      withCredentials: true  // <=========== important!
    });
    console.log(response)
    return response;
  }

  getCurrentUser(): Observable<any> {
    var response =  this.http.get('http://localhost:3000/users/currentuser', {
      withCredentials: true  // <=========== important!
    });
    console.log(response)
    return response;
  }

  getSignedRequestPhoto(file): Observable<any> {
    var response =  this.http.get(`http://localhost:3000/file/sign-s3?file-name=${file.name}&file-type=${file.type}`, {
      withCredentials: true  // <=========== important!
    });
    console.log(response)
    return response;
  }

  uploadUserPhoto (file, signedRequest): Observable<User> {
    return this.http.put<any>(signedRequest.url, file, signedRequest.signedRequest );
  }

  createUser (user): Observable<User> {
    return this.http.post<User>('/auth/createuser/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  updateUser (user): Observable<any> {
    return this.http.put<User>('/users/update/', user, httpOptions);
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
