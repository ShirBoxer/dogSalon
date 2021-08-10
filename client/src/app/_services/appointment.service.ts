import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment, } from '../_models/appointment';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AppointmentOutput } from '../_models/appointmentOutput';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseUrl = environment.apiUrl;
  private appointments$ : BehaviorSubject<Appointment[]> = new BehaviorSubject(Array());
  hoursList= ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00' ];




  constructor(private http: HttpClient,private toastr: ToastrService, private router : Router) {
    this.getAllAppointments();  
  }

  getAvailableHours(date : string):string[]{
    let hours = this.hoursList.filter(t => {
      return Date.parse(date + ' ' + t) > Date.now();
    });
    this.appointments$.getValue().filter(app => {
      let da = app.appointmentDate.toString().split('T');
      return da[0] == date;
    })
    .forEach(app =>{
      let i = hours.indexOf(app.appointmentDate.toString().split('T')[1].slice(0,5));
      if(i > -1) hours.splice(i, 1);
    });

    return hours;
  }

  createAppointment(appointmentOutput: AppointmentOutput)
    {  this.http.post<Appointment>(this.baseUrl + 'appointment/create', appointmentOutput)
        .subscribe(appointment => {
          console.log(appointment.id);
          let l = this.appointments$.getValue();
          l.push(appointment);
          this.appointments$.next(l);
          let msg = 'Your appointment was scheduled succssfully';
          this.toastr.success(msg);
          this.router.navigateByUrl('/main');
        }, error =>{
          let failedMsg = 'Operation was failed, Please try again';
          this.toastr.error(failedMsg);
          console.log(error.error);
          

        })     
  }


  getAppointmentsObs(): Observable<Array<Appointment>>{
    return this.appointments$.asObservable();}

  getAllAppointments()
  {
    this.http.get<Appointment[]>(this.baseUrl + 'appointment/get-all')
      .subscribe(data => {
        this.appointments$.next(data);
      });
  }

  cancelAppointment(appointment : Appointment): Observable<boolean>{
    return this.http.delete<boolean>(this.baseUrl + 'appointment/delete/' + appointment.id);

  }

  deleteLocally(appointment : Appointment){
    let l = this.appointments$.getValue();
    let index = l.indexOf(appointment);
    if(index > -1) l.splice(index,1);
    this.appointments$.next(l);
  }

}
