import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Appointment } from 'src/app/_models/appointment';
import { AccountService } from 'src/app/_services/account.service';
import { AppointmentService } from 'src/app/_services/appointment.service';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent implements OnInit {
  public appointment! : Appointment;
  isOwner! : boolean;
  ref : BsModalRef | undefined;

  constructor(private accountService : AccountService,
     private appointmentService : AppointmentService,
      private toastr:ToastrService, private router : Router) {}

  ngOnInit(): void {
    this.isOwner = (this.accountService.getCurrentUserName() == this.appointment.userName);

  }

  cancelAppointment(){
    console.log(this.appointment)
    this.appointmentService.cancelAppointment(this.appointment)
    .subscribe(success => {
      if(success) {
        this.toastr.success("Appointment cancellation succeed");
        this.ref?.hide();
        this.appointmentService.deleteLocally(this.appointment);
      }
      else{
        this.toastr.error("Cancellation failed, please try again")

      }
      this.ref?.hide();
    });
  }

  

}
