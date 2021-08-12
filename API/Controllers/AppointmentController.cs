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
            try{
            // config and run sql procedure  
            sqlProcedureConfigAndRun();
            }catch(Exception e){
                Console.WriteLine("exception in AppointmentController");
                Console.WriteLine(e);
            }
            
        }


        [HttpPost("create")]
        public async Task<ActionResult<AppointmentOutputDto>> CreateAsync(AppointmentInputDto appointmentDto)
        {   try{
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
            }catch(Exception e) {
                Console.WriteLine("exception in create appointment");
                Console.WriteLine(e);
                return BadRequest("internal error"); 
            }
        }


        [HttpGet("{id}")]
        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {   try{
            return await _context.Appointments.FindAsync(id);
        }catch(Exception e){
            Console.WriteLine(e);
            return null;
        }
        }
        
        [HttpGet("get-all")]
        public async Task<IEnumerable<AppointmentOutputDto>> GetAppointmentsAsync()
        {   try{
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
            }catch(Exception e){
                Console.WriteLine("exception in create appointment");
                Console.WriteLine(e);
                return new List<AppointmentOutputDto>();
            }
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
            try{
            cnnStr = _context.Database.GetConnectionString();
            atimer = new System.Timers.Timer();
            atimer.Interval= 1000*60*60;
            atimer.AutoReset = true;
            atimer.Elapsed += updateByTime;
            atimer.Start();
            }catch(Exception e){
                throw e;
            }
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
                throw e;
            }
        }

         private async Task<bool> AppointmentExists(DateTime appDate)
        {   try{
            return await _context.Appointments.AnyAsync(app => System
                .DateTime.Equals(app.AppointmentDate, appDate));
        }catch(Exception e){
            throw e;
        }
        }



         public  DateTime parseString(string date){
             try{
            string[] d = date.Split("-");
            return new DateTime(int.Parse(d[0]),int.Parse(d[1]),int.Parse(d[2]),int.Parse(d[3]),int.Parse(d[4]), 0);
            }catch(Exception e){
                throw e;
            }
         }


        

    }
    

}