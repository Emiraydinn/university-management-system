/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function DepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState("");
    const [faculty, setFaculty] = useState("");
    const [editingId, setEditingId] = useState(null);

    const role = localStorage.getItem("role");

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
        fetchDepartments();
    }, []);

    const saveDepartment = async () => {
        try {
            if (editingId) {
                await api.put(`/Departments/${editingId}`, {
                    name,
                    faculty,
                });
            } else {
                await api.post("/Departments", {
                    name,
                    faculty,
                });
            }

            setName("");
            setFaculty("");
            setEditingId(null);
            fetchDepartments();
        } catch (error) {
            console.error(error);
            alert("İşlem başarısız");
        }
    };

    const editDepartment = (department) => {
        setName(department.name);
        setFaculty(department.faculty);
        setEditingId(department.id);
    };

    const cancelEdit = () => {
        setName("");
        setFaculty("");
        setEditingId(null);
    };

    const deleteDepartment = async (id) => {
        try {
            await api.delete(`/Departments/${id}`);
            fetchDepartments();
        } catch (error) {
            console.error(error);
            alert("Bölüm silinemedi");
        }
    };

    return (
        <div className="page-container">
            <Navbar />

            <h1 className="page-title">Bölümler</h1>
            <p className="page-subtitle">Bölüm kayıtlarını görüntüle ve yönet.</p>

            <div className="grid-layout">
                {role === "Admin" && (
                    <div className="card">
                        <h3>{editingId ? "Bölüm Güncelle" : "Yeni Bölüm Ekle"}</h3>
                        <div className="form-grid">
                            <input
                                type="text"
                                placeholder="Bölüm adı"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Fakülte"
                                value={faculty}
                                onChange={(e) => setFaculty(e.target.value)}
                            />
                            <button onClick={saveDepartment}>
                                {editingId ? "Güncelle" : "Ekle"}
                            </button>

                            {editingId && (
                                <button onClick={cancelEdit}>İptal</button>
                            )}
                        </div>
                    </div>
                )}

                <div className="card">
                    <h3>Bölüm Listesi</h3>

                    <div className="list-grid">
                        {departments.map((d) => (
                            <div className="list-item" key={d.id}>
                                <div>
                                    <div className="item-title">{d.name}</div>
                                    <div className="item-subtitle">{d.faculty}</div>
                                </div>

                                {role === "Admin" && (
                                    <div className="item-actions">
                                        <button onClick={() => editDepartment(d)}>Düzenle</button>
                                        <button onClick={() => deleteDepartment(d.id)}>Sil</button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {departments.length === 0 && (
                            <p className="muted">Henüz bölüm kaydı yok.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepartmentsPage;