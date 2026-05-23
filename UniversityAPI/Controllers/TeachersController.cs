using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Entities;

namespace UniversityAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeachersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeachersController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeacherDto>>> GetAll()
        {
            var teachers = await _context.Teachers
                .Include(t => t.Department)
                .Select(t => new TeacherDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    LastName = t.LastName,
                    Title = t.Title,
                    DepartmentId = t.DepartmentId,
                    DepartmentName = t.Department.Name
                })
                .ToListAsync();

            return Ok(teachers);
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet("{id}")]
        public async Task<ActionResult<TeacherDto>> GetById(int id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.Department)
                .Where(t => t.Id == id)
                .Select(t => new TeacherDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    LastName = t.LastName,
                    Title = t.Title,
                    DepartmentId = t.DepartmentId,
                    DepartmentName = t.Department.Name
                })
                .FirstOrDefaultAsync();

            if (teacher == null)
                return NotFound("Teacher bulunamadı.");

            return Ok(teacher);
        }

        [Authorize(Roles = "Admin , User")]
        [HttpPost]
        public async Task<ActionResult> Create(CreateTeacherDto dto)
        {
            var department = await _context.Departments.FindAsync(dto.DepartmentId);

            if (department == null)
                return BadRequest("Geçersiz DepartmentId.");

            var teacher = new Teacher
            {
                Name = dto.Name,
                LastName = dto.LastName,
                Title = dto.Title,
                DepartmentId = dto.DepartmentId
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return Ok("Teacher oluşturuldu.");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateTeacherDto dto)
        {
            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null)
                return NotFound("Teacher bulunamadı.");

            teacher.Name = dto.Name;
            teacher.LastName = dto.LastName;
            teacher.Title = dto.Title;
            teacher.DepartmentId = dto.DepartmentId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null)
                return NotFound("Teacher bulunamadı.");

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}