using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
       
        public string FirstName { get; set;} 
        public string PhoneNum { get; set;}
        public ICollection<Appointment> Appointments { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }

    }
}