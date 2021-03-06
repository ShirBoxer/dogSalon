using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            // add JWT service. using addScoped to have life time of the http req
            services.AddScoped<ITokenService, TokenService>();
            // add repository
            services.AddScoped<IUserRepository,UserRepository>();

            // add sql server to services
            services.AddDbContext<DataContext>(options => 
            {
                //sql server connection configuration
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}