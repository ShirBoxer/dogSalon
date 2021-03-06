import { Component, OnInit} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Appointment } from 'src/app/_models/appointment';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { AppointmentDetailsComponent } from '../appointment-details/appointment-details.component';



@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {
  appointments : Appointment[] = [];
  selectedAppointments : Appointment[] = [];
  bsModalRef !: BsModalRef;
  _dates : string[] = [];
  filterName !: string;
  filterDate !: string;
  filteringMode !: boolean;

  constructor(private appointmentService : AppointmentService,
      private modalService: BsModalService)  { }


  ngOnInit() {
    this.filteringMode = false;
    this.filterDate = 'None';
    this.filterName = 'None';
    this.appointmentService.getAppointmentsObs().subscribe(data => {
      this.appointments = data;
      this.appointments
      .forEach(app => this._dates.push(app.appointmentDate.toString().split('T')[0]));

      this._dates = Array.from(new Set(this._dates));
      this.appointments.sort((appA,appB)=> {
          if(appA.appointmentDate >= appB.appointmentDate) return 1;
          return -1;
      });
    });
  } 

  rowSelected(index : number){
    const initialState = {appointment : this.appointments[index]};
    let ref =this.bsModalRef =this.modalService
      .show(AppointmentDetailsComponent, {initialState});

    this.bsModalRef.content.ref = ref;
  }

  close() { 
    this.bsModalRef.hide();
   }

   submit() {
     console.log('submit');
   }

   setDateFilter(d : string){
     this.filterDate = d;
   }
  
   filter(){

    if(this.filterName == '') this.filterName = 'None';
    if(this.filterDate == 'None' && this.filterName == 'None') return;

    if(this.filterDate != 'None' && this.filterName != 'None'){
      this.selectedAppointments = this.appointments.filter(app => {
        return (app.appointmentDate.toString().split('T')[0] == this.filterDate)
         && (app.userName == this.filterName.toLowerCase());
        });
    }else if(this.filterDate != 'None'){
      this.selectedAppointments = this.appointments.filter(app => {
        return (app.appointmentDate.toString().split('T')[0] == this.filterDate);
        });
    }else{
      this.selectedAppointments = this.appointments.filter(app => {
        return app.userName == this.filterName.toLowerCase();
        });
    }
      this.filteringMode = true;
   }  
   

   disableFilters(){
    this.filterDate = 'None';
    this.filterName = 'None';
     this.filteringMode=false;

   }
}

???

