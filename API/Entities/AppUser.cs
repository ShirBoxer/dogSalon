using System.Collections.Generic;

namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set;}  
        public string UserName { get; set;} 

        public byte[] PasswordHash { get; set; }

        public int PhoneNumber { get; set;}

        public byte[] PasswordSalt { get; set; }

        public ICollection<Appointment> Appointments { get; set; }

    }
}