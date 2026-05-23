using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Entities;
using Microsoft.AspNetCore.Authorization;

namespace UniversityAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentsController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll()
        {
            var departments = await _context.Departments
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Faculty = d.Faculty
                })
                .ToListAsync();

            return Ok(departments);
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDto>> GetById(int id)
        {
            var department = await _context.Departments
                .Where(d => d.Id == id)
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Faculty = d.Faculty
                })
                .FirstOrDefaultAsync();

            if (department == null)
                return NotFound("Department bulunamadı.");

            return Ok(department);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> Create(CreateDepartmentDto dto)
        {
            var department = new Department
            {
                Name = dto.Name,
                Faculty = dto.Faculty
            };

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = department.Id }, new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Faculty = department.Faculty
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateDepartmentDto dto)
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null)
                return NotFound("Department bulunamadı.");

            department.Name = dto.Name;
            department.Faculty = dto.Faculty;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null)
                return NotFound("Department bulunamadı.");

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet("{id}/students")]
        public async Task<ActionResult> GetDepartmentStudents(int id)
        {
            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == id);

            if (!departmentExists)
                return NotFound("Department bulunamadı.");

            var students = await _context.Students
                .Where(s => s.DepartmentId == id)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.LastName,
                    s.StudentNumber
                })
                .ToListAsync();

            return Ok(students);
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet("{id}/teachers")]
        public async Task<ActionResult> GetDepartmentTeachers(int id)
        {
            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == id);

            if (!departmentExists)
                return NotFound("Department bulunamadı.");

            var teachers = await _context.Teachers
                .Where(t => t.DepartmentId == id)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.LastName,
                    t.Title
                })
                .ToListAsync();

            return Ok(teachers);
        }
    }
}