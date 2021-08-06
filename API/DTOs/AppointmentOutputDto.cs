using System;

namespace API.DTOs
{
    public class AppointmentOutputDto
    {
      public DateTime AppointmentDate { get; set;}
      public DateTime CreatedDate { get; set;}
      public string UserName  { get; set;}
      public string PhoneNum { get; set;}
    }
}