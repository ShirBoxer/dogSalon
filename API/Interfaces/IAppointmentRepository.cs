using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<AppointmentDto> CreateAsync(AppointmentDto appointmentDto);
        void Update(Appointment appointment);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<Appointment>> GetAppointmentsAsync();
        Task<Appointment> GetAppointmentByIdAsync(int id);

        // by date and by user 
        // Task<Appointment> GetAppointmentsByAppUserAsync(string username);
    }
}