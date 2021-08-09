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



  constructor(private http: HttpClient,private toastr: ToastrService, private router : Router) {
    this.getAllAppointments();
  }

  

  createAppointment(appointmentOutput: AppointmentOutput)
    {  this.http.post<Appointment>(this.baseUrl + 'appointment/create', appointmentOutput)
        .subscribe(appointment => {
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

}
