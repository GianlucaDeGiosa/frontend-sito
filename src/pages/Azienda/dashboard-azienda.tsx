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
        //const res = await fetch(`http://localhost:1338/api/users/${userId}?populate=azienda`, {
        const res = await fetch(`http://localhost:1338/api/users/${userId}?populate=azienda`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const user = await res.json();
        setLoading(false);

        const aziendaId = user.azienda?.documentId;
        if (aziendaId && !localStorage.getItem("aziendaId")) {
          localStorage.setItem("aziendaId", aziendaId);
        }
        localStorage.setItem("ruolo", "azienda");

        // ➜ GET di tutte le risorse collegate all' azienda
        const [offRes, collRes, feedRes, matRes] = await Promise.all([
          fetch(`http://localhost:1338/api/offerta-lavoros?filters[azienda][documentId][$eq]=${aziendaId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
          fetch(`http://localhost:1338/api/colloquios?filters[azienda][documentId][$eq]=${aziendaId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
          fetch(`http://localhost:1338/api/feedbacks?filters[azienda][documentId][$eq]=${aziendaId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
          fetch(`http://localhost:1338/api/materiale-formativos?filters[azienda][documentId][$eq]=${aziendaId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
        ]);

        const [offData, collData, feedData, matData] = await Promise.all([
          offRes.json(),
          collRes.json(),
          feedRes.json(),
          matRes.json(),
        ]);

        setUserData({
          ...user,
          offerta_lavoros: offData.data,
          colloquios: collData.data,
          feedbacks: feedData.data,
          materiale_formativos: matData.data,
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
        <h2 className="logo" style={{ margin: 0 }}>{userData.azienda?.NomeAzienda || "Utente"}</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link active" to="/dashboard-azienda">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/profilo-azienda">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/materiale-formativo">Materiali Formativi</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/offerte">Gestione Posizioni</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/candidature-ricevute">Candidature Ricevute</Link></li>
          </ul>

        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Benvenuto {userData.azienda?.NomeAzienda || "Utente"}!</h1>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Offerte di lavoro inserite</h3>
            <p>{userData.offerta_lavoros.length ?? 0}</p>
          </div>
          <div className="card">
            <h3>Colloqui Prenotati</h3>
            <p>{userData.colloquios.length ?? 0}</p>
          </div>
          <div className="card">
            <h3>Feedback Inviati</h3>
            <p>{userData.feedbacks.length ?? 0}</p>
          </div>
          <div className="card">
            <h3>Materiale Formativo</h3>
            <p>{userData.materiale_formativos.length ?? 0}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardAzienda;
