using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;



namespace API.Controllers
{
    public class AppointmentController : BaseApiController
    {
        private readonly IAppointmentRepository _appointmentRepository;

        private readonly DataContext _context;

        public AppointmentController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<ActionResult<AppointmentOutputDto>> CreateAsync(AppointmentInputDto appointmentDto)
        {   
            //TODO - if here and if user is null line-26
            //if (await AppointmentExists(appointmentDto.AppointmentDate)) return BadRequest("Sorry the time you choose is not available, Please try again");
            AppUser user = await _context.Users.SingleOrDefaultAsync(user => user.UserName == appointmentDto.AppUserName);
            Appointment appointment = new Appointment
            {
                AppUser = user,
                AppUserId = user.Id,
                AppointmentDate = appointmentDto.AppointmentDate,
            };
            // "add" to appointment table - tracking this 
            _context.Appointments.Add(appointment);
            user.Appointments.Add(appointment);
            _context.Users.Update(user);
            // save the appointment into appointment table
            await _context.SaveChangesAsync();
                 
           
            return new AppointmentOutputDto{
             CreatedDate = appointment.CreatedDate,
             AppointmentDate = appointment.AppointmentDate,
             UserName = user.UserName,
             PhoneNumber = user.PhoneNumber
            };
        }
    }

}