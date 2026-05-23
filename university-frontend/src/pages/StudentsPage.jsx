import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [editingId, setEditingId] = useState(null);

    const role = localStorage.getItem("role");

    const fetchStudents = async () => {
        try {
            const response = await api.get("/Students");
            setStudents(response.data);
        } catch (error) {
            console.error(error);
            alert("Öğrenciler alınamadı");
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/Departments");
            setDepartments(response.data);
        } catch (error) {
            console.error(error);
            alert("Bölümler alınamadı");
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStudents();
        fetchDepartments();
    }, []);

    const saveStudent = async () => {
        try {
            const payload = {
                name,
                lastName,
                studentNumber,
                departmentId: Number(departmentId),
            };

            if (editingId) {
                await api.put(`/Students/${editingId}`, payload);
            } else {
                await api.post("/Students", payload);
            }

            setName("");
            setLastName("");
            setStudentNumber("");
            setDepartmentId("");
            setEditingId(null);
            fetchStudents();
        } catch (error) {
            console.error(error);
            alert("İşlem başarısız");
        }
    };

    const editStudent = (student) => {
        setName(student.name);
        setLastName(student.lastName);
        setStudentNumber(student.studentNumber);
        setDepartmentId(String(student.departmentId));
        setEditingId(student.id);
    };

    const cancelEdit = () => {
        setName("");
        setLastName("");
        setStudentNumber("");
        setDepartmentId("");
        setEditingId(null);
    };

    const deleteStudent = async (id) => {
        try {
            await api.delete(`/Students/${id}`);
            fetchStudents();
        } catch (error) {
            console.error(error);
            alert("Öğrenci silinemedi");
        }
    };

    return (
        <div className="page-container">
            <Navbar />

            <h1 className="page-title">Öğrenciler</h1>
            <p className="page-subtitle">Öğrenci kayıtlarını görüntüle ve yönet.</p>

            <div className="grid-layout">
                {role === "Admin" && (
                    <div className="card">
                        <h3>{editingId ? "Öğrenci Güncelle" : "Yeni Öğrenci Ekle"}</h3>

                        <div className="form-grid">
                            <input
                                type="text"
                                placeholder="Ad"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Soyad"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Öğrenci numarası"
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                            />

                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                            >
                                <option value="">Bölüm seç</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>

                            <button onClick={saveStudent}>
                                {editingId ? "Güncelle" : "Ekle"}
                            </button>

                            {editingId && (
                                <button onClick={cancelEdit}>İptal</button>
                            )}
                        </div>
                    </div>
                )}

                <div className="card">
                    <h3>Öğrenci Listesi</h3>

                    <div className="list-grid">
                        {students.map((s) => (
                            <div className="list-item" key={s.id}>
                                <div>
                                    <div className="item-title">
                                        {s.name} {s.lastName}
                                    </div>
                                    <div className="item-subtitle">
                                        {s.studentNumber} · {s.departmentName}
                                    </div>
                                </div>

                                {role === "Admin" && (
                                    <div className="item-actions">
                                        <button onClick={() => editStudent(s)}>Düzenle</button>
                                        <button onClick={() => deleteStudent(s.id)}>Sil</button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {students.length === 0 && (
                            <p className="muted">Henüz öğrenci kaydı yok.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentsPage;