import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const jwt = localStorage.getItem("jwt");
  const ruolo = localStorage.getItem("ruolo");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("ruolo");
    localStorage.removeItem("candidatoId");
    localStorage.removeItem("aziendaId");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h1>BugBusters Recruit</h1>
      <nav>
        {!jwt ? (
          <>
            <Link to="/" className="no-underline">Home</Link>
            <Link to="/register" className="no-underline">Registrati</Link>
            <Link to="/login" className="no-underline">Login</Link>
          </>
        ) : (
          <>
            {ruolo == "candidato" && (
              <Link to="/dashboard-candidato" className="no-underline">Dashboard</Link>
            )}
            {ruolo == "azienda" && (
              <Link to="/dashboard-azienda" className="no-underline">Dashboard</Link>
            )}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
