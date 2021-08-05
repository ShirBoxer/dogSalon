using System;

namespace API.DTOs
{
    public class createAppointmentDto
    {
      public DateTime AppointmentDate { get; set;}
      public CustomerDto AppUser { get; set;}

    }
}