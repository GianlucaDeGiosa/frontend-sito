import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./colloqui.css";

type Colloquio = {
  id: number;
  Stato: 
    | "Da confermare"
    | "Confermato"
    | "Annullato - Colloquio Rifiutato"
    | "Non disponibile - Cambiare Data"
    | "Completato";
  Note?: string;
  Data: string;
  azienda: { NomeAzienda: string };
  offerta_lavoro?: { Titolo: string };
};

const ColloquiRicevuti: React.FC = () => {
  const [colloqui, setColloqui] = useState<Colloquio[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [candidatoId, setCandidatoId] = useState<string | null>(null);
  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!jwt || !userId) {
        setErrore("Utente non autenticato");
        setLoading(false);
        return;
      }
      try {
        // 1) Fetch utente
        const resUser = await fetch(
          `http://localhost:1338/api/users/${userId}?populate=candidato`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        console.log("Fetch utente, status:", resUser.status);
        if (!resUser.ok) {
          console.error("Errore http caricamento utente", resUser.status);
          setLoading(false);
          return;
        }
        const userJson = await resUser.json();
        console.log("userJson:", userJson);

        const candidatoData = userJson.candidato || userJson.data?.candidato;
        console.log("candidatoData:", candidatoData);

        if (!candidatoData) {
          console.error("Candidato non trovata nel JSON:", userJson);
          setLoading(false);
          return;
        }
        const candidatoId = candidatoData.documentId;
        console.log("candidatoId:", candidatoId);
        setCandidatoId(candidatoId);

        // 3) Fetch colloqui per candidato interno
        const urlColloqui = `http://localhost:1338/api/colloquios?filters[candidato][documentId][$eq]=${candidatoId}&populate=*`;
        console.log("URL fetch colloqui:", urlColloqui);
        const resColloqui = await fetch(urlColloqui, { headers: { Authorization: `Bearer ${jwt}` } });
        console.log("Fetch colloqui, status:", resColloqui.status);
        if (!resColloqui.ok) {
          console.error("Errore http caricamento colloqui", resColloqui.status);
          setLoading(false);
          return;
        }
        const ColloquiJson = await resColloqui.json();
        console.log("colloquiJson:", ColloquiJson);
        const items = Array.isArray(ColloquiJson.data) ? ColloquiJson.data : [];

        const mapped: Colloquio[] = items.map((item: any) => ({
          id: item.id,
          Data: item.Data,
          Stato: item.Stato,
          Note: item.Note,
          azienda: item.azienda,
        }));
        setColloqui(mapped);
      } catch (err: any) {
        console.error(err);
        setErrore(err.message || "Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jwt, userId, candidatoId]);

  const aggiornaStatoColloquio = async (colloquioId: number, nuovoStato: Colloquio["Stato"]) => {

  if (!jwt) return;

  try {
    const res = await fetch(`http://localhost:1338/api/colloquios/${colloquioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          Stato: nuovoStato,
        },
      }),
    });

    if (!res.ok) {
      console.error("Errore nell'aggiornamento del colloquio");
      return;
    }

    // Aggiorna stato locale per riflettere la modifica
    setColloqui((prev) =>
      prev.map((colloquio) =>
        colloquio.id === colloquioId ? { ...colloquio, Stato: nuovoStato } : colloquio
      )
    );
  } catch (err) {
    console.error("Errore durante il fetch:", err);
  }
};


  const renderAzioni = (colloquio: Colloquio) => {
  const oggi = new Date();
  const dataColloquio = new Date(colloquio.Data);

  const pulsanti = [];

  if (colloquio.Stato === "Da confermare") {
    pulsanti.push(
      <button
        key="conferma"
        onClick={() => aggiornaStatoColloquio(colloquio.id, "Confermato")}
      >
        Conferma
      </button>,
      <button
        key="rifiuta"
        onClick={() =>
          aggiornaStatoColloquio(colloquio.id, "Annullato - Colloquio Rifiutato")
        }
      >
        Annulla - Rifiuta
      </button>,
      <button
        key="cambia-data"
        onClick={() =>
          aggiornaStatoColloquio(colloquio.id, "Non disponibile - Cambiare Data")
        }
      >
        Non disponibile
      </button>
    );
  } else if (dataColloquio < oggi && colloquio.Stato !== "Completato") {
    pulsanti.push(
      <button
        key="completa"
        onClick={() => aggiornaStatoColloquio(colloquio.id, "Completato")}
      >
        Segna come completato
      </button>
    );
  }

  return <div className="colloquio-actions">{pulsanti}</div>;
};


  return (
    <div className="materiale-formativo">
      <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte-lavoro">Offerte di Lavoro</Link></li>
            <li><Link className="no-style-link active" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h2>Colloqui ricevuti</h2>

        {loading && <div className="colloquio-loading">Caricamento colloqui...</div>}
        {errore && <div className="colloquio-error">{errore}</div>}
        {!loading && !errore && colloqui.length === 0 && (
          <div className="colloquio-empty">Non hai ancora ricevuto colloqui da nessuna azienda.</div>
        )}
        {!loading && !errore && colloqui.length > 0 && (
          <ul className="colloquio-list">
            {colloqui.map((col) => (
              <li key={col.id} className="colloquio-item">
                <div className="colloquio-header">
                  <span className={`colloquio-status status-${col.Stato.replace(/ /g, "-").toLowerCase()}`}>
                    Stato: {col.Stato}
                  </span>
                  <span className="colloquio-company">Azienda: {col.azienda.NomeAzienda}</span>
                </div>
                {col.offerta_lavoro && (
                  <div className="colloquio-job">Posizione: {col.offerta_lavoro.Titolo}</div>
                )}
                <div className="colloquio-date">Data: {new Date(col.Data).toLocaleString()}</div>
                {col.Note && <div className="colloquio-note">Note: {col.Note}</div>}
                {renderAzioni(col)}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default ColloquiRicevuti;
