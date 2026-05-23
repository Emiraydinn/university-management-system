import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/Auth/login", {
                username,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);

            navigate("/departments");
        } catch (error) {
            console.error(error);
            alert("Giriş başarısız");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h1>Üniversite Yönetim Sistemi</h1>
                <p>Devam etmek için giriş yap.</p>

                <form onSubmit={handleLogin} className="form-grid">
                    <input
                        type="text"
                        placeholder="Kullanıcı adı"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Giriş Yap</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;