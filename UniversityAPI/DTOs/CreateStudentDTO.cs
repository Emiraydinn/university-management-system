namespace UniversityAPI.DTOs
{
    public class CreateStudentDto
    {
        public string Name { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string StudentNumber { get; set; } = null!;
        public int DepartmentId { get; set; }
    }
}