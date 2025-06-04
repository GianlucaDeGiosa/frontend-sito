import React, { useEffect, useState } from 'react';
import './dashboard-azienda.css';
import { Link } from "react-router-dom";

const DashboardAzienda: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}?populate=azienda`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
        );
        const data = await res.json();
        setUserData(data);
        setLoading(false);
        if (!localStorage.getItem("aziendaId")) {
          localStorage.setItem("aziendaId", data.azienda.documentId);
        }
        localStorage.setItem("ruolo", "azienda");
      } catch (err) {
        console.error("Errore caricamento dati utente:", err);
      }
    };

    fetchUserData();
  }, [userId, jwt]);

  if (loading) return <div>Caricamento...</div>;
  if (!userData) return <div>Errore nel caricamento dati.</div>;

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">{userData.azienda?.NomeAzienda || "Utente"}</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-azienda">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/profilo-azienda">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/offerte">Offerte</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/feedback">Feedback</Link></li>
          </ul>

        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Benvenuto {userData.azienda?.NomeAzienda || "Utente"}!</h1>
          <input type="search" placeholder="Cerca..." />
        </header>

        <section className="cards">

        </section>

        <section className="analytics">
          <div className="chart-placeholder">
            <h3>Andamento Competenze Inserite</h3>
            <div className="chart-box">[Grafico Linea]</div>
          </div>

          <div className="chart-placeholder">
            <h3>Completamento Profilo</h3>
            <div className="chart-box">[Gauge Chart 83%]</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardAzienda;
