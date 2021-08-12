using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        //////////////   REGISTER   /////////////////////////
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        { try{
            if(!inputIntegrity(registerDto))  return BadRequest("Failed");

            if (await UserExist(registerDto.Username)) return BadRequest("User name is taken");
            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PhoneNum = registerDto.PhoneNum,
                FirstName = registerDto.FirstName

            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);
            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
            }catch(Exception e){
                Console.WriteLine("Exception at register");
                Console.WriteLine(e);
                return BadRequest("Failed");
            }
        }

        //////////////   LOGIN   /////////////////////////
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {   try{
            // input validation required
            var user = await _userManager.Users
            .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

            if (user == null) return Unauthorized("Invalid username");

            var result = await _signInManager
                .CheckPasswordSignInAsync(user,loginDto.Password,false);

            if(!result.Succeeded) return Unauthorized("Invalid password");

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
            }catch(Exception e){
                Console.WriteLine("Exception at login");
                Console.WriteLine(e);
                return BadRequest("Failed");
            }
        }

        private async Task<bool> UserExist(string username)
        {   try{
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
            }catch(Exception e){
               throw e;
            }
        }

        private bool inputIntegrity(RegisterDto registerDto){
            if(registerDto == null) return false;
            if(registerDto.Username == null || registerDto.Username == "" ||
                registerDto.Password == null ||registerDto.PhoneNum == null || registerDto.PhoneNum == "")
                {
                    Console.WriteLine("integrity check failed at " + DateTime.Now);
                    Console.WriteLine(registerDto);
                    return false;
                }
            return true;

        }
    }
}