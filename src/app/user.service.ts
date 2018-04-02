

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

  createUser (user): Observable<User> {
    return this.http.post<User>('http://localhost:3000/auth/createuser/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  updateUser (user): Observable<any> {
    return this.http.put<User>('http://localhost:3000/users/update/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  login (user): Observable<any> {
    return this.http.post<User>('http://localhost:3000/auth/login/', user, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addHero', hero))
      // );
  }

  googleLogin (): Observable<any> {
    var response =  this.http.get('http://localhost:3000/auth/google', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  logout (): Observable<any> {
    var response =  this.http.get('http://localhost:3000/auth/logout', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }

  checkAuthorization (): Observable<any> {
    var response =  this.http.get('http://localhost:3000/auth/checkauth', {
      withCredentials: true  // <=========== important!
    });
    return response;
  }
  
}
