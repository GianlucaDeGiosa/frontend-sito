import React, { useEffect, useState } from 'react';
import './dashboard-candidato.css';
import { Link } from "react-router-dom";

const DashboardCandidato: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const res = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}?populate=candidato`, {
        const res = await fetch(`http://localhost:1338/api/users/${userId}?populate=candidato`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
        );
        const data = await res.json();
        setUserData(data);
        setLoading(false);
        if (!localStorage.getItem("candidatoId")) {
          localStorage.setItem("candidatoId", data.candidato.documentId);
        }
        localStorage.setItem("ruolo", "candidato");
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
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/preferenze">Attitudini e Preferenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte-suggerite">Offerte di Lavoro</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Benvenuto {userData.candidato?.Nome || "Utente"}!</h1>
          <input type="search" placeholder="Cerca..." />
        </header>

        <section className="cards">
          <div className="card">
            <h3>Competenze</h3>
            <p>{userData.competenze?.length || 0}</p>
          </div>
          <div className="card">
            <h3>Colloqui Prenotati</h3>
            <p>{userData.colloquis?.length || 0}</p>
          </div>
          <div className="card">
            <h3>Offerte Salvate</h3>
            <p>{userData.offertes?.length || 0}</p>
          </div>
          <div className="card">
            <h3>Feedback Ricevuti</h3>
            <p>{userData.feedbacks?.length || 0}</p>
          </div>
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

export default DashboardCandidato;
