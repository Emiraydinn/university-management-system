/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function TeachersPage() {
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [title, setTitle] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [editingId, setEditingId] = useState(null);

    const role = localStorage.getItem("role");

    const fetchTeachers = async () => {
        try {
            const response = await api.get("/Teachers");
            setTeachers(response.data);
        } catch (error) {
            console.error(error);
            alert("Öğretmenler alınamadı");
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
        fetchTeachers();
        fetchDepartments();
    }, []);

    const saveTeacher = async () => {
        try {
            const payload = {
                name,
                lastName,
                title,
                departmentId: Number(departmentId),
            };

            if (editingId) {
                await api.put(`/Teachers/${editingId}`, payload);
            } else {
                await api.post("/Teachers", payload);
            }

            setName("");
            setLastName("");
            setTitle("");
            setDepartmentId("");
            setEditingId(null);
            fetchTeachers();
        } catch (error) {
            console.error(error);
            alert("İşlem başarısız");
        }
    };

    const editTeacher = (teacher) => {
        setName(teacher.name);
        setLastName(teacher.lastName);
        setTitle(teacher.title);
        setDepartmentId(String(teacher.departmentId));
        setEditingId(teacher.id);
    };

    const cancelEdit = () => {
        setName("");
        setLastName("");
        setTitle("");
        setDepartmentId("");
        setEditingId(null);
    };

    const deleteTeacher = async (id) => {
        try {
            await api.delete(`/Teachers/${id}`);
            fetchTeachers();
        } catch (error) {
            console.error(error);
            alert("Öğretmen silinemedi");
        }
    };

    return (
        <div className="page-container">
            <Navbar />

            <h1 className="page-title">Öğretmenler</h1>
            <p className="page-subtitle">Öğretmen kayıtlarını görüntüle ve yönet.</p>

            <div className="grid-layout">
                {role === "Admin" && (
                    <div className="card">
                        <h3>{editingId ? "Öğretmen Güncelle" : "Yeni Öğretmen Ekle"}</h3>

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
                                placeholder="Ünvan"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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

                            <button onClick={saveTeacher}>
                                {editingId ? "Güncelle" : "Ekle"}
                            </button>

                            {editingId && (
                                <button onClick={cancelEdit}>İptal</button>
                            )}
                        </div>
                    </div>
                )}

                <div className="card">
                    <h3>Öğretmen Listesi</h3>

                    <div className="list-grid">
                        {teachers.map((t) => (
                            <div className="list-item" key={t.id}>
                                <div>
                                    <div className="item-title">
                                        {t.name} {t.lastName}
                                    </div>
                                    <div className="item-subtitle">
                                        {t.title} · {t.departmentName}
                                    </div>
                                </div>

                                {role === "Admin" && (
                                    <div className="item-actions">
                                        <button onClick={() => editTeacher(t)}>Düzenle</button>
                                        <button onClick={() => deleteTeacher(t.id)}>Sil</button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {teachers.length === 0 && (
                            <p className="muted">Henüz öğretmen kaydı yok.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeachersPage;