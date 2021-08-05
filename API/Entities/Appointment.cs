using System;

namespace API.Entities
{
    public class Appointment
    {
         public int Id { get; set;}

         public DateTime CreatedDate { get; set;} = DateTime.Now;

         public DateTime AppointmentDate { get; set;}

         public AppUser AppUser { get; set;}

         public int AppUserId { get; set;}


          
    }
}