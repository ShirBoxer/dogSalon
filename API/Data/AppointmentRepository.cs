using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class AppointmentRepository : IAppointmentRepository
    {   private readonly DataContext _context;
        private UserRepository userRepo;

        public AppointmentRepository(DataContext context)
        {
             _context = context;
            userRepo = new UserRepository(_context);
        }

        public  async Task<AppointmentOutputDto> CreateAsync(AppointmentInputDto appointmentDto)

        {   //TODO - if here and if user is null line-26
            //if (await AppointmentExists(appointmentDto.AppointmentDate)) return BadRequest("Sorry the time you choose is not available, Please try again");
           
            AppUser user = await userRepo.GetUserByNameAsync(appointmentDto.AppUserName);
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

        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments.FindAsync(id);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsAsync()
        {
            return await _context.Appointments.ToArrayAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(Appointment appointment)
        {
            _context.Entry(appointment).State = EntityState.Modified;

        }
         private async Task<bool> AppointmentExists(DateTime appDate)
        {
            return await _context.Appointments
            .AnyAsync(app => System.DateTime.Equals(app.AppointmentDate, appDate));
        }
    }
}