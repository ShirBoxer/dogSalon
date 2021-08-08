using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using API.Entities;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;



namespace API.Controllers
{
    public class AppointmentController : BaseApiController
    {

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
                AppointmentDate = parseString(appointmentDto.AppointmentDate)
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
             PhoneNum = user.PhoneNum
            };
        }



        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments.FindAsync(id);
        }
        [HttpGet("get-all")]
        public async Task<IEnumerable<AppointmentOutputDto>> GetAppointmentsAsync()
        {
            Appointment[] appointmentsArr = await _context.Appointments.ToArrayAsync();
            List<AppointmentOutputDto> outputArr = new List<AppointmentOutputDto>();
            // Console.WriteLine(appointmentsArr[1].AppUser.PhoneNum);
            // Console.WriteLine(outputArr.Length);
            for(int i=0; i< appointmentsArr.Length; i++){
                AppUser user = await _context.Users.FindAsync(appointmentsArr[i].AppUserId);
                AppointmentOutputDto app = new AppointmentOutputDto{
                    CreatedDate = appointmentsArr[i].CreatedDate,
                    AppointmentDate = appointmentsArr[i].AppointmentDate,
                    UserName = user.UserName,
                    PhoneNum = user.PhoneNum
                 };
                outputArr.Add(app);
            }
          
            return outputArr;
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
            return await _context.Appointments.AnyAsync(app => System
                .DateTime.Equals(app.AppointmentDate, appDate));
        }



         public  DateTime parseString(string date){
            string[] d = date.Split("-");
            return new DateTime(int.Parse(d[0]),int.Parse(d[1]),int.Parse(d[2]),int.Parse(d[3]),int.Parse(d[4]), 0);
         }
    }
    

}