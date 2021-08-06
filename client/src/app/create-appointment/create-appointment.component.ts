import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { AppointmentService } from '../_services/appointment.service';



@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {
  model ?: NgbDateStruct;
  accountModel:any = {};
  hoursList ?: string[];
  selectedHour: string ="00:00";
  successMsg = 'Your appointment was scheduled succssfully';
  failedMsg = 'Operation was failed, Please try again'


  freeHours ?: string; 
  constructor(private appointmentService: AppointmentService,private accountService : AccountService ,private toastr: ToastrService, private router : Router) { 
    this.hoursList= ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00' ];

  }

  ngOnInit(): void {
    
  }

  onChange(): void{
    this.freeHours = 'aaa';
  
  }

  parseModel(): string{
    if(this.model != null){
      let date = this.model.year + "";
      if(this.model.month < 10) date += '-0' + this.model.month;
      else date += '-' + this.model.month;
      if(this.model.day < 10) date += '-0' + this.model.day;
      else date += '-' + this.model.day;
      let time = this.selectedHour.split(":");
      date+= '-' + time[0] + '-' + time[1];
      return date;
    }
    return "";
  }

  createAppointment()
  { 
    let userName = this.accountService.getCurrentUserName();
    let strDate = this.parseModel();
    if(strDate == "" || userName == undefined) return;
    //todo toast
    
    let appointmentOutput = {
      AppointmentDate: strDate,
      AppUserName: userName,
    }
    console.log(appointmentOutput);
    this.appointmentService.createAppointment(appointmentOutput).subscribe(response =>{
      if(response){
      let msg = 'Your appointment was scheduled succssfully';
      this.toastr.success(this.successMsg);
      this.router.navigateByUrl('/main');
      }
    },
      error =>{
      this.toastr.error(this.failedMsg);
      console.log(error.error);
      
    });
  }

  getHour(hour : any){
    this.selectedHour = hour;
  }



  

}
