import React, { useEffect, useState } from "react";
import "./OfferteLavoro.css";
import { Link } from "react-router-dom";

type Benefit = { Nome: string };
type Requisito = { Competenza: string; LivelloCompetenza: string };

type Offerta = {
  id: number;
  Titolo: string;
  Descrizione: string;
  Sede?: string;
  TipoContratto?: string;
  EsperienzaRichiesta?: string;
  Benefit?: Benefit[];
  Requisito?: Requisito[];
  NomeAzienda?: string;
};


const OfferteLavoro: React.FC = () => {
  const [offerte, setOfferte] = useState<Offerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOfferta, setEditingOfferta] = useState<Offerta | null>(null);
  const [candidatoInfo, setCandidatoInfo] = useState<{ Nome: string; Cognome: string } | null>(null);

  // Funzioni per gestire l'apertura/chiusura form e i campi
  const handleOpenForm = (offerta: Offerta) => {
    setEditingOfferta(offerta);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingOfferta(null);
    setShowForm(false);
  };

  // Stati per ricerca e filtri
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocalita, setFilterLocalita] = useState("");
  const [filterTipoContratto, setFilterTipoContratto] = useState("");

  // Preferiti
  const [preferiti, setPreferiti] = useState<number[]>([]);

  const jwt = localStorage.getItem("jwt");
  const candidatoId = localStorage.getItem("candidatoId");

  useEffect(() => {
    if (!jwt || !candidatoId) {
      setErrore("Utente non autenticato");
      setLoading(false);
      return;
    }

    const fetchOfferte = async () => {
      try {
        const url = `http://localhost:1338/api/offerta-lavoros?populate[azienda][fields][0]=NomeAzienda&populate[Benefit][fields][0]=Nome&populate[Requisito][fields][0]=*`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Errore ${res.status}: ${text}`);
        }

        const data = await res.json();

        if (Array.isArray(data.data)) {
          const offerteConAzienda = data.data.map((offerta: any) => ({
            id: offerta.id,
            Titolo: offerta.Titolo,
            Descrizione: offerta.Descrizione,
            Sede: offerta.Sede,
            TipoContratto: offerta.TipoContratto,
            EsperienzaRichiesta: offerta.EsperienzaRichiesta,
            Benefit: offerta.Benefit || [],
            Requisito: offerta.Requisito || [],
            NomeAzienda: offerta.azienda?.NomeAzienda || null,
          }));

          setOfferte(offerteConAzienda);
        }


      } catch (error: any) {
        setErrore(error.message || "Errore nel caricamento delle offerte");
        setOfferte([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCandidato = async () => {
      try {
        const res = await fetch(`http://localhost:1338/api/candidatoes/${candidatoId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok) {
          throw new Error("Errore nel recupero dati candidato");
        }

        const data = await res.json();
        const { Nome, Cognome } = data.data;
        setCandidatoInfo({ Nome, Cognome });
        console.log("Dati candidato:", data.data);
      } catch (err: any) {
        console.error("Errore caricamento candidato:", err);
        setErrore("Errore nel caricamento del candidato");
      }
    };

    fetchOfferte();
    fetchCandidato();

    const salvati = JSON.parse(localStorage.getItem("preferitiOfferte") || "[]");
    setPreferiti(salvati);
  }, [jwt, candidatoId]);

  const togglePreferito = (id: number) => {
    let nuovi: number[];
    if (preferiti.includes(id)) {
      nuovi = preferiti.filter((pid) => pid !== id);
    } else {
      nuovi = [id, ...preferiti];
    }
    setPreferiti(nuovi);
    localStorage.setItem("preferitiOfferte", JSON.stringify(nuovi));
  };

  const handleCandidatura = async (offertaId: number, candidatoId: string) => {
    const offerta = offerte.find((o) => o.id === offertaId);
    if (!offerta || !candidatoInfo) {
      alert("Impossibile candidarsi: dati mancanti");
      return;
    }

    const payload = {
      data: {
        offerta_lavoro: offertaId,
        candidato: parseInt(candidatoId),
      },
    };

    try {
      const res = await fetch("http://localhost:1338/api/candidatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      console.log("Payload inviato:", payload);
      console.log("Risposta API:", responseText);

      if (!res.ok) throw new Error(responseText);

      alert(`Candidatura inviata con successo per l'offerta "${offerta.Titolo}"`);
    } catch (err) {
      console.error("Errore durante l'invio:", err);
      alert("Errore durante l'invio della candidatura");
    }
  };




  // Estrae valori unici per dropdown filtro
  const uniqueValues = (field: keyof Offerta): string[] => {
    const vals = offerte
      .map((off) => off[field])
      .filter((v): v is string | number => v !== undefined && v !== null && v !== "")  // <-- type guard qui
      .map((v) => v.toString());
    return Array.from(new Set(vals)).sort();
  };

  // Filtra le offerte in base a ricerca e filtri
  const filteredOfferte = offerte.filter((off) => {
    const textMatch =
      off.Titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.Descrizione.toLowerCase().includes(searchTerm.toLowerCase());

    const localitaMatch = filterLocalita === "" || off.Sede === filterLocalita;
    const tipoContrattoMatch = filterTipoContratto === "" || off.TipoContratto === filterTipoContratto;

    return textMatch && localitaMatch && tipoContrattoMatch;
  });

  // Ordina: prima i preferiti
  const offerteOrdinati = [
    ...filteredOfferte.filter((off) => preferiti.includes(off.id)),
    ...filteredOfferte.filter((off) => !preferiti.includes(off.id)),
  ];

  if (loading) return <div>Caricamento offerte suggerite...</div>;
  if (errore) return <div style={{ color: "red" }}>{errore}</div>;
  if (offerte.length === 0) return <div>Nessuna offerta suggerita trovata.</div>;

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link active" to="/dashboard-candidato/offerte-lavoro">Offerte di Lavoro</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h2>Offerte di Lavoro Suggerite</h2>

        <div className="filtri-ricerca">
          <input
            type="text"
            placeholder="Cerca per titolo o descrizione..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-ricerca"
          />

          <div className="filtro-group">
            <label>
              <strong>Località:</strong>
              <select
                value={filterLocalita}
                onChange={(e) => setFilterLocalita(e.target.value)}
              >
                <option value="">Tutte</option>
                {uniqueValues("Sede").map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="filtro-group">
            <label>
              <strong>Tipo Contratto:</strong>
              <select
                value={filterTipoContratto}
                onChange={(e) => setFilterTipoContratto(e.target.value)}
              >
                <option value="">Tutti</option>
                {uniqueValues("TipoContratto").map((tc) => (
                  <option key={tc} value={tc}>
                    {tc}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <ul className="offerte-lista">
          {offerteOrdinati.length === 0 ? (
            <p>Nessuna offerta corrisponde ai criteri selezionati.</p>
          ) : (
            offerteOrdinati.map((offerta) => (
              <li key={offerta.id} className="offerta-card">
                <h3>{offerta.Titolo}</h3>
                <p>{offerta.Descrizione}</p>
                <p><strong>Località:</strong> {offerta.Sede}</p>
                <p><strong>Tipo Contratto:</strong> {offerta.TipoContratto}</p>

                <div className="bottoni-offerta">
                  <button className="primary-button" onClick={() => togglePreferito(offerta.id)}>
                    {preferiti.includes(offerta.id)
                      ? "Rimuovi dai preferiti"
                      : "Salva nei preferiti"}
                  </button>
                  <button className="primary-button" onClick={() => handleCandidatura(offerta.id, candidatoId!)}>
                    Candidati
                  </button>
                  <button className="primary-button" onClick={() => handleOpenForm(offerta)}>
                    Maggiori informazioni
                  </button>
                </div>

                {showForm && editingOfferta?.id === offerta.id && (
                  <div
                    className="dashboard-azienda-section"
                    style={{
                      marginTop: "1rem",
                      border: "1px solid #ccc",
                      padding: "1rem",
                      borderRadius: "6px",
                      background: "#f9f9f9",
                    }}
                  >
                    <h3>Dettagli posizione: {editingOfferta.Titolo}</h3>

                    <div className="profilo-dettaglio">
                      <strong>Titolo:</strong> {editingOfferta.Titolo}
                    </div>

                    <div className="profilo-dettaglio">
                      <strong>Descrizione:</strong> {editingOfferta.Descrizione}
                    </div>

                    <div className="profilo-dettaglio">
                      <strong>Tipo contratto:</strong> {editingOfferta.TipoContratto}
                    </div>

                    <div className="profilo-dettaglio">
                      <strong>Sede:</strong> {editingOfferta.Sede}
                    </div>

                    <div className="profilo-dettaglio">
                      <strong>Esperienza richiesta:</strong>{" "}
                      {editingOfferta.EsperienzaRichiesta || "Non specificata"}
                    </div>

                    {(() => {
                      const benefitsList = editingOfferta.Benefit ?? [];
                      const requisitiList = editingOfferta.Requisito ?? [];
                      const nomeAzienda = editingOfferta.NomeAzienda ?? "Non disponibile";

                      return (
                        <>
                          <div className="profilo-dettaglio">
                            <strong>Benefit:</strong>{" "}
                            {benefitsList.length > 0
                              ? benefitsList.map((b) => b.Nome).filter(Boolean).join(", ")
                              : "Nessuno"}
                          </div>

                          <div className="profilo-dettaglio">
                            <strong>Requisiti:</strong>{" "}
                            {requisitiList.length > 0
                              ? requisitiList
                                .map((r) => `${r.Competenza} (${r.LivelloCompetenza})`)
                                .join(", ")
                              : "Nessuno"}
                          </div>

                          <div className="profilo-dettaglio">
                            <strong>Nome Azienda:</strong> {nomeAzienda}
                          </div>
                        </>
                      );
                    })()}

                    <div style={{ marginTop: "1rem" }}>
                      <button className="secondary-button" onClick={handleCloseForm}>
                        Chiudi
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
};

export default OfferteLavoro;