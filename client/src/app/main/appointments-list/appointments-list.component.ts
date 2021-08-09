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
  selectedByName !: boolean;
  selectedByDate !: boolean;
  filterName : string = '';


  constructor(private appointmentService : AppointmentService,private modalService: BsModalService)  { }


  ngOnInit() {
    this.appointmentService.getAppointmentsObs().subscribe(data => {
      this.appointments = data;
      this.appointments
      .forEach(app => this._dates.push(app.appointmentDate.toString().split('T')[0]));
      this._dates = Array.from(new Set(this._dates));
    });
    this.selectedByName = false;
    this.selectedByDate = false;
  } 

  ngOnDestroy(){
    //TODO
    // this.appointmentService.getAppointmentsObs().unsubscribe();
  }

  rowSelected(index : number){
    this.bsModalRef =this.modalService.show(AppointmentDetailsComponent, {class: "modal-lg"});
    this.bsModalRef.content.appointment = this.appointments[index];
  }

  close() { 
    this.bsModalRef.hide();
   }
   submit() {
     console.log('submit');
   }

   filterByDate(d : string){
    this.selectedByDate = true;
    this.selectedAppointments = this.appointments.filter(app => {
      return app.appointmentDate.toString().split('T')[0] == d;
      });
   
   }
  
   onKey(event: any){
     this.filterName = event.target.value;
   }

   filterByName(){
    this.selectedByName = true;
    this.selectedAppointments = this.appointments.filter(app => {
      return app.userName == this.filterName;
      });
    }  
   

   disableFilters(){
     this.selectedByName = false;
     this.selectedByDate = false;

   }
}

​

