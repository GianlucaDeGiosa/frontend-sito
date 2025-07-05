import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./feedback.css";

type Feedback = {
  id: number;
  Valutazione: "Idoneo" | "Da approfondire" | "Non idoneo";
  Commento: Array<{type: string; children: Array<{ text: string }>;}>;
  azienda: { NomeAzienda: string };
  offerta_lavoro?: { Titolo: string };
};

const FeedbackRicevuti: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
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

        // 3) Fetch feedback per candidato interno
        const urlFb = `http://localhost:1338/api/feedbacks?filters[candidato][documentId][$eq]=${candidatoId}&populate=*`;
        console.log("URL fetch offerte:", urlFb);
        const resFb = await fetch(urlFb, { headers: { Authorization: `Bearer ${jwt}` } });
        console.log("Fetch offerte, status:", resFb.status);
        if (!resFb.ok) {
          console.error("Errore http caricamento offerte", resFb.status);
          setLoading(false);
          return;
        }
        const FbJson = await resFb.json();
        console.log("offJson:", FbJson);
        const items = Array.isArray(FbJson.data) ? FbJson.data : [];

        const mapped: Feedback[] = items.map((item: any) => ({
        id: item.id,
        Valutazione: item.Valutazione,
        Commento: item.Commento || [],
        azienda: item.azienda,
        offerta_lavoro: item.offerta_lavoro,
        }));
        setFeedbacks(mapped);
      } catch (err: any) {
        console.error(err);
        setErrore(err.message || "Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jwt, userId, candidatoId]);

  return (
    <div className="feedback">
      <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte-lavoro">Offerte di Lavoro</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link active" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h2>Feedback ricevuti</h2>
        {loading && <div className="feedback-loading">Caricamento feedback...</div>}
        {errore && <div className="feedback-error">{errore}</div>}
        {!loading && !errore && feedbacks.length === 0 && (
          <div className="feedback-empty">Non sono ancora stati rilasciati feedback dalle aziende.</div>
        )}
        {!loading && !errore && feedbacks.length > 0 && (
          <ul className="feedback-list">
            {feedbacks.map((fb) => (
              <li key={fb.id} className="feedback-item">
                <div className="feedback-header">
                  <span className={`feedback-rating rating-${fb.Valutazione.replace(/ /g, "-").toLowerCase()}`}>Valutazione: {fb.Valutazione}</span>
                  <span className="feedback-company">Azienda: {fb.azienda.NomeAzienda}</span>
                </div>
                {fb.offerta_lavoro && <div className="feedback-job">Posizione: {fb.offerta_lavoro.Titolo}</div>}
                <div className="feedback-comment">Commento: 
                  {fb.Commento.map((block, idx: number) => (
                    <p key={idx}>
                    {block.children?.map((child: { text: string }, i: number) => (
                    <React.Fragment key={i}>{child.text}</React.Fragment>
                    ))}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default FeedbackRicevuti;
