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
  // const [filterTitoloStudio, setFilterTitoloStudio] = useState("");
  const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null);
  const [feedback, setFeedback] = useState<FeedbackPayload>({ Valutazione: "Da approfondire", Commento: "" });
  const [aziendaId, setAziendaId] = useState<string | null>(null);


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
                console.log("Fetch utente, status:", resUser.status);
                if (!resUser.ok) {
                    console.error("Errore HTTP caricamento utente", resUser.status);
                    setLoading(false);
                    return;
                }
                const userJson = await resUser.json();
                console.log("userJson:", userJson);

                const aziendaData = userJson.azienda || userJson.data?.azienda;
                console.log("aziendaData:", aziendaData);

                if (!aziendaData) {
                    console.error("Azienda non trovata nel JSON:", userJson);
                    setLoading(false);
                    return;
                }
                const aziendaId = aziendaData.documentId;
                console.log("aziendaId:", aziendaId);
                setAziendaId(aziendaId);

                // 2) Fetch offerte
                const urlOff = `http://localhost:1338/api/offerta-lavoros?filters[azienda][documentId][$eq]=${aziendaId}&populate[azienda][fields][0]=NomeAzienda&populate[Benefit][fields][0]=Nome&populate[Requisito][fields][0]=*`;
                console.log("URL fetch offerte:", urlOff);
                const resOff = await fetch(urlOff, { headers: { Authorization: `Bearer ${jwt}` } });
                console.log("Fetch offerte, status:", resOff.status);
                if (!resOff.ok) {
                    console.error("Errore HTTP caricamento offerte", resOff.status);
                    setLoading(false);
                    return;
                }
                const offJson = await resOff.json();
                console.log("offJson:", offJson);
                // offJson.data è array di offerte; vedi se offJson.data.length > 0
                setOfferte(
                    offJson.data.map((item: any) => ({
                        id: item.id,
                        Titolo: item.Titolo,
                        Descrizione: item.Descrizione,
                        TipoContratto: item.TipoContratto,
                        Sede: item.Sede,
                        EsperienzaRichiesta: item.EsperienzaRichiesta,
                        Benefit: item.Benefit?.map((b: any) => ({
                            Nome: b?.Nome || ""
                        })) || [],
                        Requisito: item.Requisito?.map((r: any) => ({
                            Competenza: r.Competenza,
                            LivelloCompetenza: r.LivelloCompetenza
                        })) || [],
                    }))
                );
            } catch (err) {
                console.error("Errore in fetchData:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId, jwt]);

  // 2) Carica Candidature quando seleziono un’Offerta
  useEffect(() => {
    if (!selectedOffertaId) return;
    setLoading(true);
    async function fetchCandidature() {
      try {
        const res = await fetch(
          `http://localhost:1338/api/candidatures?filters[offerta_lavoro][id][$eq]=${selectedOffertaId}&populate[candidato][populate]=competenzas,users_permissions_user,CurriculumVitae`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        const json = await res.json();
        setCandidature(json.data.map((c: any) => ({
          id: c.id,
          candidato: {
            id: c.candidato.id,
            Nome: c.candidato.Nome,
            Cognome: c.candidato.Cognome,
            LivelloEsperienza: c.candidato.LivelloEsperienza,
            TitoloStudioRichiesto: c.candidato.TitoloStudioRichiesto,
            competenze: c.candidato.competenzas,
            CurriculumVitae: c.candidato.CurriculumVitae,
          }
        })));
      } catch {
        setErrore("Errore nel caricamento delle candidature.");
      } finally {
        setLoading(false);
      }
    }
    fetchCandidature();

  }, [selectedOffertaId, jwt]);

  // Helpers per dropdown
  const uniqueEsperienze = Array.from(
    new Set(candidature.map(c => c.candidato.LivelloEsperienza).filter(Boolean))
  ) as string[];
  const uniqueCompetenze = Array.from(
    new Set(candidature.flatMap(c => c.candidato.competenze?.map(k => k.Nome) || []))
  );

  // Filtraggio candidature
  const filtered = candidature.filter((c) => {
    const expMatch = !filterEsperienza || c.candidato.LivelloEsperienza === filterEsperienza;
    const compMatch = !filterCompetenza
      || c.candidato.competenze?.some(k => k.Nome === filterCompetenza);
    return expMatch && compMatch;
  });

  // Invio feedback
  const submitFeedback = async () => {
    if (!selectedCandidatura) return;
    const payload = {
      data: {
        Valutazione: feedback.Valutazione,
        Commento: feedback.Commento,
        candidato: selectedCandidatura.candidato.id,
        offerta_lavoro: selectedOffertaId,
        azienda: aziendaId
      }
    };
    const res = await fetch("http://localhost:1338/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert("Feedback inviato!");
      setSelectedCandidatura(null);
      setFeedback({ Valutazione: "Da approfondire", Commento: "" });
    } else {
      alert("Errore nell’invio del feedback.");
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
                {/*<h2 className="logo" style={{ margin: 0 }}>{azienda.azienda?.NomeAzienda || "Utente"}</h2>*/}
                <nav className="nav">
                    <ul>
                        <li><Link className="no-style-link" to="/dashboard-azienda">Dashboard</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/profilo-azienda">Profilo</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/materiale-formativo">Materiale Formativi Aziendali</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/offerte">Gestione Posizioni</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/colloqui">Colloqui</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/candidature-ricevute">Candidature Ricevute</Link></li>
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
            onChange={(e) => setSelectedOffertaId(Number(e.target.value))}
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
              <li key={c.id} onClick={() => setSelectedCandidatura(c)}>
                {c.candidato.Nome} {c.candidato.Cognome} — {c.candidato.LivelloEsperienza}
              </li>
            ))}
            {filtered.length === 0 && <p>Nessun candidato corrisponde ai filtri.</p>}
          </ul>
        )}

        {/* 4) Form feedback per candidato */}
        {selectedCandidatura && (
          <div className="feedback-form">
            <h3>Feedback per {selectedCandidatura.candidato.Nome} {selectedCandidatura.candidato.Cognome}</h3>
            {/* Link al CV */}
            {selectedCandidatura.candidato.CurriculumVitae?.map((file, i) => (
              <p key={i}>
                <a href={file.url} target="_blank" rel="noreferrer" >Visualizza CV #{i+1}</a>
              </p>
            ))}
            <label>
              Valutazione:
              <select
                value={feedback.Valutazione}
                onChange={e => setFeedback(f => ({ ...f, Valutazione: e.target.value as any }))}
              >
                <option value="Idoneo">Idoneo</option>
                <option value="Da approfondire">Da approfondire</option>
                <option value="Non idoneo">Non idoneo</option>
              </select>
            </label>
            <label>
              Commento:
              <textarea
                value={feedback.Commento}
                onChange={e => setFeedback(f => ({ ...f, Commento: e.target.value }))}
                rows={4}
              />
            </label>
            <button className="primary-button" onClick={submitFeedback}>Salva Feedback</button>
            <button className="secondary-button" onClick={() => setSelectedCandidatura(null)}>Annulla</button>
          </div>
        )}

        {errore && <div className="feedback-error">{errore}</div>}
      </main>
    </div>
  );
};

export default CandidatureRicevute;
