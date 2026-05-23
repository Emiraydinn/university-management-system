namespace UniversityAPI.DTOs
{
    public class CreateTeacherDto
    {
        public string Name { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public int DepartmentId { get; set; }
    }
}