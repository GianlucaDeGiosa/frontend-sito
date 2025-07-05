// src/pages/dashboard-azienda/colloqui.tsx
import React, { useEffect, useState , useCallback} from "react";
import { Link } from "react-router-dom";
import "./colloqui.css";

/* ────────── tipi ────────── */
type Colloquio = {
  id: number;
  candidato: string;              // ← aggiunto
  data: string;
  posizione: string;
  stato: string;
  note: string;
};

const Colloqui: React.FC = () => {
  /* ────────── state ────────── */
  const [azienda, setAzienda]   = useState<any>(null);
  const [colloqui, setColloqui] = useState<Colloquio[]>([]);
  const [loading, setLoading]   = useState(true);

  const jwt    = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  /* ────────── fetch colloqui (riutilizzabile) ────────── */
  const fetchColloqui = useCallback(async (aziendaId: string) => {
    try {
      const url =
        `http://localhost:1338/api/colloquios` +
        `?filters[azienda][documentId][$eq]=${aziendaId}` +
        `&populate[offerta_lavoro][fields][0]=Titolo` +
        `&populate[candidato][fields][0]=Nome` +
        `&populate[candidato][fields][1]=Cognome`;

      const res  = await fetch(url, { headers: { Authorization: `Bearer ${jwt}` } });
      const json = await res.json();
      if (!Array.isArray(json.data)) return;

      const mapped: Colloquio[] = json.data.map((c: any) => ({
        id: c.id,
        candidato: `${c.candidato?.Nome || "?"} ${c.candidato?.Cognome || ""}`,
        data: c.Data,
        posizione: c.offerta_lavoro?.Titolo || "—",
        stato: c.Stato,
        note: c.Note || "",
      }));

      setColloqui(mapped);
    } catch (err) {
      console.error("Errore nel caricamento colloqui:", err);
    }
  }, [jwt]);

  /* ────────── fetch azienda + colloqui ────────── */
  useEffect(() => {
    if (!jwt || !userId) return;

    const fetchAzienda = async () => {
      try {
        const res = await fetch(
          `http://localhost:1338/api/users/${userId}?populate=azienda`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        const data = await res.json();
        setAzienda(data);
        const aziendaId = data.azienda.documentId;
        localStorage.setItem("aziendaId", aziendaId);
        localStorage.setItem("ruolo", "azienda");
        /* carica colloqui */
        await fetchColloqui(aziendaId);
      } catch (err) {
        console.error("Errore caricamento azienda:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAzienda();
  }, [jwt, userId, fetchColloqui]);

  /* ────────── UI ────────── */
  if (loading)          return <div>Caricamento…</div>;
  if (!azienda)         return <div>Errore nel caricamento dati.</div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">{azienda.azienda?.NomeAzienda || "Azienda"}</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-azienda">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/profilo-azienda">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/materiale-formativo">Materiali Formativi</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/offerte">Gestione Posizioni</Link></li>
            <li><Link className="no-style-link active" to="/dashboard-azienda/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/candidature-ricevute">Candidature Ricevute</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Colloqui programmati</h1>

        {colloqui.length === 0 ? (
          <p>Nessun colloquio programmato.</p>
        ) : (
          <table className="colloqui-table">
            <thead>
              <tr>
                <th>Candidato</th>
                <th>Data</th>
                <th>Offerta lavorativa</th>
                <th>Stato</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {colloqui.map((c) => (
                <tr key={c.id}>
                  <td>{c.candidato}</td>
                  <td>{new Date(c.data).toLocaleString()}</td>
                  <td>{c.posizione}</td>
                  <td>{c.stato}</td>
                  <td>{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Colloqui;