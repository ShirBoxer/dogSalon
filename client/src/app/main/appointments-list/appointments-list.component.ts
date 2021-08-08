import { Component, OnInit} from '@angular/core';
import { Appointment } from 'src/app/_models/appointment';
import { AppointmentService } from 'src/app/_services/appointment.service';



@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {
  appointments : Appointment[] = [];
  
  constructor(private appointmentService : AppointmentService)  { }


  ngOnInit(): void {
    this.appointmentService.getAllAppointments()
      .subscribe(appointmentsList => {
      if(appointmentsList){
        this.appointments = appointmentsList
      }
    });
  } 

}

​

