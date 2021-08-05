using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AppointmentController
    {
        private readonly IAppointmentRepository _appointmentRepository;


        public AppointmentController(AppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        [HttpPost("creating-appointment")]
        public async Task<ActionResult<AppointmentDto>> CreateAsync(AppointmentDto appointmentDto)
        {
            return await _appointmentRepository.CreateAsync(appointmentDto);
        }
    }

}