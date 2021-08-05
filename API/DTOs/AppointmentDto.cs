using System;

namespace API.DTOs
{
    public class AppointmentDto
    {
         public DateTime AppointmentDate { get; set;}

         public CustomerDto AppUser { get; set;}

         public int AppUserId { get; set;}
    }
}