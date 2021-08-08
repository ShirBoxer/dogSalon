import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    title = 'Dogs Salon';
    users: any;

  constructor(private accountService: AccountService){}

  ngOnInit() {
    this.setCurrentUser();
    
  }

  setCurrentUser(){
    var storageUser = localStorage.getItem('user');
    var user: User;
    if(storageUser != null){ 
      user = JSON.parse(storageUser);
      this.accountService.setCurrentUser(user);
    }
  }
  
 

}

