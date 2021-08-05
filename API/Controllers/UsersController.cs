using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{   // we get it from BaseApiController
    // [ApiController]
    // [Route("api/[controller]")]
    public class UsersController : BaseApiController
    {   //TODO
        private readonly IUserRepository _userRepository;
        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await _userRepository.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

         [HttpGet("{username}")]
        public async Task<ActionResult<AppUser>> GetUserByName(string name)
        {
            return await _userRepository.GetUserByNameAsync(name);
        }
    }
}