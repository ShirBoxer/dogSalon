import { Component, OnInit } from '@angular/core';
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


  freeHours ?: string; 
  constructor(private appointmentService: AppointmentService,private accountService : AccountService ,private toastr: ToastrService) { 
    this.hoursList= ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00' ];

  }

  ngOnInit(): void {
    
  }

  onChange(): void{
    this.freeHours = 'aaa';
  
  }

  parseModel(): string{
    if(this.model != null)
    return this.model.year + '-' + this.model.month + '-' + this.model.day;

    return "";
  }

  createAppointment()
  { 
    let userName = this.accountService.getCurrentUserName();
    let strDate = this.parseModel();
    if(strDate == "" || userName == undefined) return;
    //todo toast

    let date = new Date(strDate);
    let time = this.selectedHour.split(':');
    date.setHours(+time[0]);
    date.setMinutes(+time[1]);

    let appointmentOutput = {
      AppointmentDate: date,
      AppUserName: userName,
    }
    console.log(appointmentOutput);
    this.appointmentService.createAppointment(appointmentOutput).subscribe(response =>{},
      error =>{
      console.log(error);
      this.toastr.error(error.error);
    });
  }

  getHour(hour : any){
    this.selectedHour = hour;
  }



  

}
