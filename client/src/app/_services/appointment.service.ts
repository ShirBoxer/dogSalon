import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment, } from '../_models/appointment';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AppointmentOutput } from '../_models/appointmentOutput';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseUrl = environment.apiUrl;



  constructor(private http: HttpClient) {
   }

   createAppointment(appointmentOutput: AppointmentOutput): Observable<Appointment>{
    return this.http.post<Appointment>(this.baseUrl + 'appointment/create', appointmentOutput);
    
  }

  getAllAppointments(): Observable<Appointment[]>{
    return this.http.get<Appointment[]>(this.baseUrl + 'appointment/get-all');
  }

}
