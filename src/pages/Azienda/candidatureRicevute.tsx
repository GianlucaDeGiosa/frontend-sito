import React, { useEffect, useState } from "react";
import "./candidatureRicevute.css";
import { Link } from "react-router-dom";

type Candidato = {
  id: number;
  Nome: string;
  Cognome: string;
  LivelloEsperienza?: "Junior" | "Mid" | "Senior";
  competenze?: { Nome: string }[];
  CurriculumVitae?: { url: string }[];
};

type Offerta = {
  id: number;
  Titolo: string;
};

type Candidatura = {
  id: number;
  candidato: Candidato;
};

type FeedbackPayload = {
  Valutazione: "Idoneo" | "Da approfondire" | "Non idoneo";
  Commento: string;
};

const CandidatureRicevute: React.FC = () => {
  const [offerte, setOfferte] = useState<Offerta[]>([]);
  const [selectedOffertaId, setSelectedOffertaId] = useState<number | null>(null);
  const [candidature, setCandidature] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [filterEsperienza, setFilterEsperienza] = useState("");
  const [filterCompetenza, setFilterCompetenza] = useState("");
  const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null);

  // Stati per feedback
  const [feedback, setFeedback] = useState<FeedbackPayload>({ Valutazione: "Da approfondire", Commento: "" });

  // Stati per prenotazione colloquio
  const [dataColloquio, setDataColloquio] = useState<string>("");
  const [noteColloquio, setNoteColloquio] = useState<string>("");

  const [aziendaId, setAziendaId] = useState<string | null>(null);
  const [aziendaData, setAziendaData] = useState<any>(null);
  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !jwt) {
        console.warn("Manca userId o jwt");
        setLoading(false);
        return;
      }

      try {
        // 1) Fetch utente
        const resUser = await fetch(
          `http://localhost:1338/api/users/${userId}?populate=azienda`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        if (!resUser.ok) {
          setLoading(false);
          return;
        }
        const userJson = await resUser.json();
        const aziendaData = userJson.azienda || userJson.data?.azienda;
        if (!aziendaData) {
          setLoading(false);
          return;
        }
        setAziendaData(aziendaData);
        setAziendaId(aziendaData.documentId);

        // 2) Fetch offerte
        const urlOff = `http://localhost:1338/api/offerta-lavoros?filters[azienda][documentId][$eq]=${aziendaData.documentId}&populate[azienda][fields][0]=NomeAzienda&populate[Benefit][fields][0]=Nome&populate[Requisito][fields][0]=*`;
        const resOff = await fetch(urlOff, { headers: { Authorization: `Bearer ${jwt}` } });
        const offJson = await resOff.json();
        setOfferte(
          offJson.data.map((item: any) => ({ id: item.id, Titolo: item.Titolo }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, jwt, aziendaData]);

  useEffect(() => {
    if (!selectedOffertaId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:1338/api/candidatures?filters[offerta_lavoro][id][$eq]=${selectedOffertaId}&populate[candidato][populate]=*`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        const json = await res.json();
        setCandidature(
          json.data.map((c: any) => ({
            id: c.id,
            candidato: {
              id: c.candidato.id,
              Nome: c.candidato.Nome,
              Cognome: c.candidato.Cognome,
              LivelloEsperienza: c.candidato.LivelloEsperienza,
              competenze: c.candidato.competenzas,
              CurriculumVitae: c.candidato.CurriculumVitae,
            }
          }))
        );
      } catch {
        setErrore("Errore nel caricamento delle candidature.");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedOffertaId, jwt]);

  const uniqueEsperienze = Array.from(
    new Set(candidature.map(c => c.candidato.LivelloEsperienza).filter(Boolean))
  ) as string[];

  const uniqueCompetenze = Array.from(
    new Set(candidature.flatMap(c => c.candidato.competenze?.map(k => k.Nome) || []))
  );

  const filtered = candidature.filter(c => {
    const expMatch = !filterEsperienza || c.candidato.LivelloEsperienza === filterEsperienza;
    const compMatch = !filterCompetenza || c.candidato.competenze?.some(k => k.Nome === filterCompetenza);
    return expMatch && compMatch;
  });

  // Funzione invio feedback
  const submitFeedback = async () => {
    if (!selectedCandidatura) return;
    const commentText = feedback.Commento.trim();
    const payload = {
      data: {
        Valutazione: feedback.Valutazione,
        Commento: [{ type: "paragraph", children: [{ type: "text", text: commentText }] }],
        candidato: selectedCandidatura.candidato.id,
        offerta_lavoro: selectedOffertaId,
        azienda: aziendaId
      }
    };

    try {
      const res = await fetch("http://localhost:1338/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Errore creazione feedback");
      alert("Feedback inviato!");
      setSelectedCandidatura(null);
      setFeedback({ Valutazione: "Da approfondire", Commento: "" });
    } catch (err) {
      console.error(err);
      alert("Errore nell’invio del feedback.");
    }
  };

  // Funzione prenotazione colloquio
  const submitColloquio = async () => {
    if (!selectedCandidatura) return;
    if (!dataColloquio) {
      alert("Seleziona data e ora del colloquio.");
      return;
    }
    const payload = {
      data: {
        Data: dataColloquio,
        Note: noteColloquio,
        Stato: "Da confermare",
        candidato: selectedCandidatura.candidato.id,
        offerta_lavoro: selectedOffertaId,
        azienda: aziendaId
      }
    };

    try {
      const res = await fetch("http://localhost:1338/api/colloquios", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Errore creazione colloquio");
      alert("Colloquio prenotato!");
      setSelectedCandidatura(null);
      setDataColloquio("");
      setNoteColloquio("");
    } catch (err) {
      console.error(err);
      alert("Errore nella prenotazione del colloquio.");
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">{aziendaData?.NomeAzienda || "Azienda"}</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-azienda">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/profilo-azienda">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/materiale-formativo">Materiali Formativi</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/offerte">Gestione Posizioni</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link active" to="/dashboard-azienda/candidature-ricevute">Candidature Ricevute</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h2>Candidature ricevute</h2>
        {/* 1) Selezione Offerta */}
        <div className="filtro-offerta">
          <label>Seleziona Offerta:</label>
          <select
            value={selectedOffertaId || ""}
            onChange={e => setSelectedOffertaId(Number(e.target.value))}
          >
            <option value="">-- Scegli --</option>
            {offerte.map(o => <option key={o.id} value={o.id}>{o.Titolo}</option>)}
          </select>
        </div>
        {/* 2) Filtri candidati */}
        {selectedOffertaId && !loading && (
          <div className="filtri-candidati">
            <select value={filterEsperienza} onChange={e => setFilterEsperienza(e.target.value)}>
              <option value="">Esperienza (tutte)</option>
              {uniqueEsperienze.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select value={filterCompetenza} onChange={e => setFilterCompetenza(e.target.value)}>
              <option value="">Competenza (tutte)</option>
              {uniqueCompetenze.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
        {/* 3) Lista candidati */}
        {loading && <p>Caricamento candidature…</p>}
        {!loading && selectedOffertaId && (
          <ul className="candidati-lista">
            {filtered.map(c => (
              <li key={c.id} className="candidato-item" onClick={() => setSelectedCandidatura(c)}>
                <strong>{c.candidato.Nome} {c.candidato.Cognome}</strong> — {c.candidato.LivelloEsperienza}
                <br />
                {c.candidato.CurriculumVitae?.map((cv, index) => (
                  <div key={cv.url || index} className="cv-link">
                    <button
                      className="primary-button"
                      onClick={() => window.open(`http://localhost:1338${cv.url}`, "_blank", "noopener,noreferrer")}
                    >
                      Visualizza CV
                    </button>
                  </div>
                ))}

              </li>
            ))}
            {filtered.length === 0 && <p>Nessun candidato corrisponde ai filtri.</p>}
          </ul>
        )}
        {/* 4) Form feedback & colloquio */}
        {selectedCandidatura && (
          <div className="feedback-colloquio-forms">
            {/* Form Feedback */}
            <div className="feedback-form">
              <h3>Feedback per {selectedCandidatura.candidato.Nome} {selectedCandidatura.candidato.Cognome}</h3>
              {selectedCandidatura.candidato.CurriculumVitae?.map((file, i) => (
                <p key={i}>
                  <a href={file.url} target="_blank" rel="noreferrer">Visualizza CV #{i + 1}</a>
                </p>
              ))}
              <label>
                Valutazione:
                <select value={feedback.Valutazione} onChange={e => setFeedback(f => ({ ...f, Valutazione: e.target.value as any }))}>
                  <option value="Idoneo">Idoneo</option>
                  <option value="Da approfondire">Da approfondire</option>
                  <option value="Non idoneo">Non idoneo</option>
                </select>
              </label>
              <label>
                Commento:
                <textarea rows={4} value={feedback.Commento} onChange={e => setFeedback(f => ({ ...f, Commento: e.target.value }))} />
              </label>
              <button className="primary-button" onClick={submitFeedback}>Invia Feedback</button>
              <button className="secondary-button" onClick={() => setSelectedCandidatura(null)}>Annulla</button>
            </div>
            {/* Form Colloquio */}
            <div className="colloquio-form">
              <h3>Prenota colloquio per {selectedCandidatura.candidato.Nome} {selectedCandidatura.candidato.Cognome}</h3>
              <label>
                Data e ora:
                <input
                  type="datetime-local"
                  value={dataColloquio}
                  onChange={e => setDataColloquio(e.target.value)}
                />
              </label>
              <label>
                Note:
                <textarea rows={3} value={noteColloquio} onChange={e => setNoteColloquio(e.target.value)} />
              </label>
              <button className="primary-button" onClick={submitColloquio}>Prenota Colloquio</button>
              <button className="secondary-button" onClick={() => setSelectedCandidatura(null)}>Annulla</button>
            </div>
          </div>
        )}
        {errore && <div className="feedback-error">{errore}</div>}
      </main>
    </div>
  );
};

export default CandidatureRicevute;
