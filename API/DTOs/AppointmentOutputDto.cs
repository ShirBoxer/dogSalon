using System;

namespace API.DTOs
{
    public class AppointmentOutputDto
    {
      public int Id { get; set;}
      public DateTime CreatedDate { get; set;}
      public DateTime AppointmentDate { get; set;}
      public string UserName  { get; set;}
      public string PhoneNum { get; set;}
    }
}