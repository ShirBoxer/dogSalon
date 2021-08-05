import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main/main.component';
import { MainCarouselComponent } from './main/main-carousel/main-carousel.component';
import { AppointmentsListComponent } from './main/appointments-list/appointments-list.component';
import { SharedModule } from './_modules/shared.module';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MainComponent,
    MainCarouselComponent,
    AppointmentsListComponent,
    CreateAppointmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    NgbModule,
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
