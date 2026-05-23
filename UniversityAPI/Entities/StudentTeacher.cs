namespace UniversityAPI.Entities
{
    public class StudentTeacher
    {
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; } = null!;
    }
}