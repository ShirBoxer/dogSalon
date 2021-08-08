using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        public string FirstName { get; set;} 

        public string PhoneNum { get; set;}

        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }

    }
}