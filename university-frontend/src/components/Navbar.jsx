import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <div className="navbar">
            <div className="nav-links">
                <Link to="/departments">Bölümler</Link>
                <Link to="/teachers">Öğretmenler</Link>
                <Link to="/students">Öğrenciler</Link>
            </div>

            <div className="nav-user">
                <span>
                    {username} ({role})
                </span>
                <button onClick={handleLogout}>Çıkış Yap</button>
            </div>
        </div>
    );
}

export default Navbar;