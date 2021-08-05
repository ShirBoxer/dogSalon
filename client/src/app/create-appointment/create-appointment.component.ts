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
  selectedHour?: string;


  freeHours ?: string; 
  constructor(private appointmentService: AppointmentService,private toastr: ToastrService) { 
    this.hoursList= ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00' ];

  }

  ngOnInit(): void {
    
  }

  onChange(): void{
    this.freeHours = 'aaa';
  
  }

  createAppointment()
  { 
    this.appointmentService.createAppointment(this.accountModel).subscribe(response =>{},
      error =>{
      console.log(error);
      this.toastr.error(error.error);
    });
  }

  getHour(hour : any){
    console.log(typeof hour);
  }

  

}
