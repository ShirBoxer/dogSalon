import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { Appointment } from '../_models/appointment';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppointmentOutput } from '../_models/AppointmentOutput';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseUrl = environment.apiUrl;
  private accountService;

  constructor(private http: HttpClient) {
    this.accountService = new AccountService(http);
   }

   createAppointment(appointmentOutput: AppointmentOutput){
    return this.http.post<Appointment>(this.baseUrl + 'appointment/create', appointmentOutput).pipe(
      map((appointment: Appointment) => {
        if (appointment) {
          localStorage.setItem('appointment', JSON.stringify(appointment));
        }
      })
    )
  }

}
