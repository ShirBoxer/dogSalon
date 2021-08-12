using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using API.Entities;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Timers;
using Microsoft.AspNetCore.Http;

namespace API.Controllers
{
    public class AppointmentController : BaseApiController
    {

        private readonly DataContext _context;
        private static System.Timers.Timer atimer;
        private static String cnnStr;
        public AppointmentController(DataContext context)
        {
            _context = context;
            // config and run sql procedure  
            sqlProcedureConfigAndRun();
            
        }


        [HttpPost("create")]
        public async Task<ActionResult<AppointmentOutputDto>> CreateAsync(AppointmentInputDto appointmentDto)
        {   
            if (await AppointmentExists(parseString(appointmentDto.AppointmentDate))) return BadRequest("Sorry the time you choose is not available, Please try again");
            AppUser user = await _context.Users.SingleOrDefaultAsync(user => user.UserName == appointmentDto.AppUserName);
            if(user == null) return StatusCode(StatusCodes.Status500InternalServerError, "appointment data was damaged");

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
             Id = appointment.Id,
             CreatedDate = appointment.CreatedDate,
             AppointmentDate = appointment.AppointmentDate,
             UserName = user.UserName,
             PhoneNum = user.PhoneNum
            };
        }


        [HttpGet("{id}")]
        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments.FindAsync(id);
        }
        
        [HttpGet("get-all")]
        public async Task<IEnumerable<AppointmentOutputDto>> GetAppointmentsAsync()
        {   
            Appointment[] appointmentsArr = await _context.Appointments.ToArrayAsync();
            List<AppointmentOutputDto> outputArr = new List<AppointmentOutputDto>();
            
            for(int i=0; i< appointmentsArr.Length; i++){
                AppUser user = await _context.Users.FindAsync(appointmentsArr[i].AppUserId);
                AppointmentOutputDto app = new AppointmentOutputDto{
                    Id = appointmentsArr[i].Id,
                    CreatedDate = appointmentsArr[i].CreatedDate,
                    AppointmentDate = appointmentsArr[i].AppointmentDate,
                    UserName = user.UserName,
                    PhoneNum = user.PhoneNum
                 };
                outputArr.Add(app);
            }
          
            return outputArr;
        }


        [HttpDelete("delete/{id:int}")]
        public async Task<ActionResult<Boolean>> DeleteAsync(int id){
            try{
                var appointmentToDelete = await this.GetAppointmentByIdAsync(id);
                if( appointmentToDelete == null) return false;
                this._context.Appointments.Remove(appointmentToDelete);
                await this._context.SaveChangesAsync();
                return true;
            }
            catch (Exception e){
                Console.WriteLine(e.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error deleting data");
            }
        }

         private void sqlProcedureConfigAndRun(){
            cnnStr = _context.Database.GetConnectionString();
            atimer = new System.Timers.Timer();
            atimer.Interval= 1000*60*60;
            atimer.AutoReset = true;
            atimer.Elapsed += updateByTime;
            atimer.Start();
        } 
        private static void updateByTime(object source, ElapsedEventArgs args){

            try{
            String spName = @"dbo.[moveAppointments]";
            SqlConnection connection = new SqlConnection(cnnStr);
            SqlCommand cmd = new SqlCommand(spName,connection);
            connection.Open();
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader dr = cmd.ExecuteReader();
            dr.Close();
            connection.Close();
            }catch(Exception e) {
                Console.WriteLine("calling to procedure failed");
                Console.WriteLine(e);
            }
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