import React, { useEffect, useState } from "react";
import "./profilo.css";
import { Link } from "react-router-dom";

const ProfiloAzienda: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}?populate=azienda`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const data = await res.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error("Errore caricamento dati utente:", err);
      }
    };

    fetchUserData();
  }, [userId, jwt]);

  if (loading) return <div>Caricamento...</div>;
  if (!userData) return <div>Errore nel caricamento dati.</div>;

  const azienda = userData.azienda;

  return (
    <div className="admin-profilo">
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
      <main className="profilo-azienda">
        <h2>Il tuo profilo</h2>

        <div className="profilo-dettaglio"><strong>Logo:</strong><br />
          {azienda?.Logo ? (
            <img src={azienda.Logo} alt="Logo Azienda" className="logo-img" />
          ) : "Non caricato"}
        </div>

        <div className="profilo-riga">
          <div className="profilo-dettaglio"><strong>Nome Azienda:</strong> {azienda?.NomeAzienda || "Non specificato"}</div>
          <div className="profilo-dettaglio"><strong>Email:</strong> {userData.email}</div>
        </div>

        <div className="profilo-riga">
          <div className="profilo-dettaglio"><strong>Settore:</strong> {azienda?.Settore || "Non specificato"}</div>
          <div className="profilo-dettaglio"><strong>Partita IVA:</strong> {azienda?.PartitaIva || "Non specificata"}</div>
        </div>

        <div className="profilo-riga">
          <div className="profilo-dettaglio"><strong>Sede Legale:</strong> {azienda?.SedeLegale || "Non specificata"}</div>
          <div className="profilo-dettaglio"></div>
        </div>

        <div className="profilo-dettaglio"><strong>Cultura Aziendale:</strong> {azienda?.Cultura || "Non specificata"}</div>
        <div className="profilo-dettaglio"><strong>Descrizione:</strong> {azienda?.Descrizione || "Non specificata"}</div>


      </main>
    </div>
  );
};

export default ProfiloAzienda;
