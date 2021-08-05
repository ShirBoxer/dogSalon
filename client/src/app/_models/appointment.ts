import { User } from "./user";

export interface Appointment {
    CreatedDate: Date,
    AppointmentDate: Date;
    AppUser: User;
}