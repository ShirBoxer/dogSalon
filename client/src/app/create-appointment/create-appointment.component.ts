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
  dateSelected!: boolean; 

  constructor(private appointmentService: AppointmentService,private accountService : AccountService ,private toastr: ToastrService, private router : Router) { 

  }

  ngOnInit(): void {
    this.dateSelected = false;
  }

  onChange(): void{
    this.dateSelected = true;
    console.log("onChange");
    this.hoursList = this.appointmentService.getAvailableHours(this.parseDate());
  
  }

  parseDate(): string{
    if(this.model != null){
      let date = this.model.year + "";
      if(this.model.month < 10) date += '-0' + this.model.month;
      else date += '-' + this.model.month;
      if(this.model.day < 10) date += '-0' + this.model.day;
      else date += '-' + this.model.day;
      return date;
    }
    return "";
  }
  parseTime(): string{
      let time = this.selectedHour.split(":");
      return time[0] + '-' + time[1];
  }

  parseModel(): string{
    return this.parseDate() + '-' + this.parseTime();
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
    this.appointmentService.createAppointment(appointmentOutput);
  }

  getHour(hour : any){
    this.selectedHour = hour;
  }



  

}
