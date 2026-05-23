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
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetAll()
        {
            var students = await _context.Students
                .Include(s => s.Department)
                .Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    LastName = s.LastName,
                    StudentNumber = s.StudentNumber,
                    DepartmentId = s.DepartmentId,
                    DepartmentName = s.Department.Name
                })
                .ToListAsync();

            return Ok(students);
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDto>> GetById(int id)
        {
            var student = await _context.Students
                .Include(s => s.Department)
                .Where(s => s.Id == id)
                .Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    LastName = s.LastName,
                    StudentNumber = s.StudentNumber,
                    DepartmentId = s.DepartmentId,
                    DepartmentName = s.Department.Name
                })
                .FirstOrDefaultAsync();

            if (student == null)
                return NotFound("Student bulunamadı.");

            return Ok(student);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> Create(CreateStudentDto dto)
        {
            var department = await _context.Departments.FindAsync(dto.DepartmentId);

            if (department == null)
                return BadRequest("Geçersiz DepartmentId.");

            var studentNumberExists = await _context.Students
                .AnyAsync(s => s.StudentNumber == dto.StudentNumber);

            if (studentNumberExists)
                return BadRequest("Bu öğrenci numarası zaten kayıtlı.");

            var student = new Student
            {
                Name = dto.Name,
                LastName = dto.LastName,
                StudentNumber = dto.StudentNumber,
                DepartmentId = dto.DepartmentId
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok("Student oluşturuldu.");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateStudentDto dto)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
                return NotFound("Student bulunamadı.");

            var department = await _context.Departments.FindAsync(dto.DepartmentId);

            if (department == null)
                return BadRequest("Geçersiz DepartmentId.");

            var studentNumberExists = await _context.Students
                .AnyAsync(s => s.StudentNumber == dto.StudentNumber && s.Id != id);

            if (studentNumberExists)
                return BadRequest("Bu öğrenci numarası başka bir öğrenciye ait.");

            student.Name = dto.Name;
            student.LastName = dto.LastName;
            student.StudentNumber = dto.StudentNumber;
            student.DepartmentId = dto.DepartmentId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
                return NotFound("Student bulunamadı.");

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin , User")]
        [HttpGet("{id}/teachers")]
        public async Task<ActionResult> GetStudentTeachers(int id)
        {
            var studentExists = await _context.Students.AnyAsync(s => s.Id == id);

            if (!studentExists)
                return NotFound("Student bulunamadı.");

            var teachers = await _context.StudentTeachers
                .Where(st => st.StudentId == id)
                .Include(st => st.Teacher)
                .Select(st => new
                {
                    st.Teacher.Id,
                    st.Teacher.Name,
                    st.Teacher.LastName,
                    st.Teacher.Title
                })
                .ToListAsync();

            return Ok(teachers);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/teachers")]
        public async Task<ActionResult> AssignTeacher(int id, AssignTeacherDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound("Student bulunamadı.");

            var teacher = await _context.Teachers.FindAsync(dto.TeacherId);
            if (teacher == null)
                return NotFound("Teacher bulunamadı.");

            var exists = await _context.StudentTeachers
                .AnyAsync(st => st.StudentId == id && st.TeacherId == dto.TeacherId);

            if (exists)
                return BadRequest("Bu öğretmen zaten öğrenciye atanmış.");

            var studentTeacher = new StudentTeacher
            {
                StudentId = id,
                TeacherId = dto.TeacherId
            };

            _context.StudentTeachers.Add(studentTeacher);
            await _context.SaveChangesAsync();

            return Ok("Öğretmen öğrenciye atandı.");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{studentId}/teachers/{teacherId}")]
        public async Task<ActionResult> RemoveTeacher(int studentId, int teacherId)
        {
            var studentTeacher = await _context.StudentTeachers
                .FirstOrDefaultAsync(st => st.StudentId == studentId && st.TeacherId == teacherId);

            if (studentTeacher == null)
                return NotFound("Öğrenci-öğretmen ilişkisi bulunamadı.");

            _context.StudentTeachers.Remove(studentTeacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}