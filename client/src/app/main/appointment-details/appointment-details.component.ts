import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/_models/appointment';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent implements OnInit {
  public appointment! : Appointment;
  constructor() { }

  ngOnInit(): void {
    
  }

  

}
