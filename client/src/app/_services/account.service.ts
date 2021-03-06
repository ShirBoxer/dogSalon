import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      // everything inside the pipe is Rxjs operator
      map((response: User) => {
        const user = response;
        if(user){
          // populate our user inside local storage in the browser and set as current user
          this.setCurrentUser(user);

        }

      }));
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);

          
        }
      })
    )
  }

  setCurrentUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  getCurrentUserName():string | undefined{
    var user = localStorage.getItem('user');
    if(user != null){
      return JSON.parse(user).username;
    }
    return undefined;
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
  }

  
}
