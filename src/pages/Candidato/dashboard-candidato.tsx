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
        const res = await fetch(`http://localhost:1338/api/users/${userId}?populate=candidato`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const user = await res.json();
        setLoading(false);

        const candidatoId = user.candidato?.documentId;
        if (candidatoId && !localStorage.getItem("candidatoId")) {
          localStorage.setItem("candidatoId", candidatoId);
        }
        localStorage.setItem("ruolo", "candidato");

        // ➜ GET di tutte le risorse collegate al candidato
        const [compRes, collRes, feedRes] = await Promise.all([
          fetch(`http://localhost:1338/api/competenzas?filters[candidatoes][documentId][$eq]=${candidatoId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
          fetch(`http://localhost:1338/api/colloquios?filters[candidato][documentId][$eq]=${candidatoId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
          fetch(`http://localhost:1338/api/feedbacks?filters[candidato][documentId][$eq]=${candidatoId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
        ]);

        const [compData, collData, feedData] = await Promise.all([
          compRes.json(),
          collRes.json(),
          feedRes.json(),
        ]);

        setUserData({
          ...user,
          competenze: compData.data,
          colloquis: collData.data,
          feedbacks: feedData.data,
        });

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
            <li><Link className="no-style-link active" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte-lavoro">Offerte di Lavoro</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Benvenuto {userData.candidato?.Nome || "Utente"}!</h1>
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
            <h3>Feedback Ricevuti</h3>
            <p>{userData.feedbacks?.length || 0}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardCandidato;
