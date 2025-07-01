import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './materialeFormativo.css';

const VisualizzaMaterialeFormativo = () => {
  const [materiali, setMateriali] = useState<any[]>([]);
  const [aziende, setAziende] = useState<any[]>([]);
  const [ricerca, setRicerca] = useState("");
  const [messaggio, setMessaggio] = useState("Caricamento in corso...");
  const [preferiti, setPreferiti] = useState<number[]>([]);

  const jwt = localStorage.getItem("jwt");

const fetchMateriali = React.useCallback(async () => {
    try {
      const res = await fetch(
        // `https://lovable-horses-1f1c111d86.strapiapp.com/api/materiale-formativos?filters[Pubblico][$eq]=true&populate=File`,
        `http://localhost:1338/api/materiale-formativos?filters[Pubblico][$eq]=true&populate=File`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const data = await res.json();
      setMateriali(data.data);
      setMessaggio(data.data.length ? "" : "Nessun materiale disponibile.");
    } catch (err) {
      console.error("Errore fetch materiali:", err);
      setMessaggio("Errore durante il caricamento dei materiali.");
    }
  }, [jwt]);


const fetchAziende = React.useCallback(async () => {
    try {
      const res = await fetch(
        // `https://lovable-horses-1f1c111d86.strapiapp.com/api/aziendas`,
        `http://localhost:1338/api/aziendas`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const data = await res.json();
      setAziende(data.data);
    } catch (err) {
      console.error("Errore fetch aziende:", err);
    }
  }, [jwt]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAziende();
    fetchMateriali();
    const salvati = JSON.parse(localStorage.getItem("preferitiMateriali") || "[]");
    setPreferiti(salvati);
  }, [fetchAziende, fetchMateriali]);

  const togglePreferito = (id: number) => {
    let nuovi;
    if (preferiti.includes(id)) {
      nuovi = preferiti.filter((pid) => pid !== id);
    } else {
      nuovi = [...preferiti, id];
    }
    setPreferiti(nuovi);
    localStorage.setItem("preferitiMateriali", JSON.stringify(nuovi));
  };

  const materialiConAzienda = materiali.map((mat) => {
    const azienda = aziende.find((a) => a.id === mat.azienda) || null;
    return {
      ...mat,
      aziendaNome: azienda?.attributes?.NomeAzienda || "Sconosciuta",
    };
  });

  const materialiFiltrati = materialiConAzienda.filter((mat) => {
    const titolo = mat.Titolo?.toLowerCase() || "";
    const azienda = mat.aziendaNome?.toLowerCase() || "";
    const ricercaTesto = ricerca.trim().toLowerCase();
    return !ricercaTesto || titolo.includes(ricercaTesto) || azienda.includes(ricercaTesto);
  });

  // Prima i preferiti
  const ordinati = [
    ...materialiFiltrati.filter((m) => preferiti.includes(m.id)),
    ...materialiFiltrati.filter((m) => !preferiti.includes(m.id)),
  ];

  return (
    <div className="materiale-formativo">
    <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/preferenze">Attitudini e Preferenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte">Offerte Lavorative</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <div className="materiale-form">
          <h1>Materiale Formativo</h1>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Cerca per titolo o azienda..."
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
            />
          </div>

          {messaggio && <p>{messaggio}</p>}

          <div className="materiali-lista">
            {ordinati.length === 0 && !messaggio ? (
              <p>Nessun materiale corrispondente alla ricerca.</p>
            ) : (
              ordinati.map((mat) => {
                const fileUrl = mat.File?.[0]?.url || "";
                return (
                  <div key={mat.id} className="materiale-card">
                    <h3>{mat.Titolo || "Senza titolo"}</h3>
                    <p>{mat.Descrizione || "Nessuna descrizione"}</p>
                    <p><strong>Azienda:</strong> {mat.aziendaNome}</p>
                    {fileUrl && (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        Scarica file
                      </a>
                    )}
                    <button onClick={() => togglePreferito(mat.id)}>
                      {preferiti.includes(mat.id) ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisualizzaMaterialeFormativo;
