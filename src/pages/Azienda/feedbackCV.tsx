import React, { useEffect, useState } from "react";

interface Utente {
  id: number;
  username: string;
  email: string;
}

interface Feedback {
  id: number;
  valutazione: number;
  commento: string;
}

interface Candidatura {
  id: number;
  utente: Utente;
  curriculumUrl?: string;
  feedback?: Feedback[];
}

interface OffertaLavoro {
  id: number;
  Titolo: string;
  Descrizione: string;
  candidatures: Candidatura[];
}

const CandidatureOfferteAzienda: React.FC = () => {
  const [aziendaId, setAziendaId] = useState<number | null>(null);
  const [offerte, setOfferte] = useState<OffertaLavoro[]>([]);
  const [loading, setLoading] = useState(true);
  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAziendaId = async () => {
      if (!userId || !jwt) {
        console.warn("Manca userId o jwt");
        setLoading(false);
        return;
      }

      try {
        // 1) Prendo id azienda dall'utente
        const resUser = await fetch(
          `http://localhost:1338/api/users/${userId}?populate=azienda`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        if (!resUser.ok) {
          console.error("Errore fetch utente");
          setLoading(false);
          return;
        }
        const userJson = await resUser.json();
        const aziendaData = userJson.data?.azienda || userJson.azienda;
        if (!aziendaData) {
          console.error("Azienda non trovata");
          setLoading(false);
          return;
        }
        setAziendaId(aziendaData.id || aziendaData.documentId || null);
      } catch (e) {
        console.error("Errore:", e);
        setLoading(false);
      }
    };

    fetchAziendaId();
  }, [userId, jwt]);

  useEffect(() => {
    if (!aziendaId || !jwt) return;

    const fetchOfferteConCandidature = async () => {
      setLoading(true);
      try {
        // Popola candidatures e utente (e feedback)
        // L'endpoint va adattato per Strapi: populate nested
        // Assumiamo questo populate: candidatures.utente, candidatures.feedback
        const url = `http://localhost:1338/api/offerta-lavoros?filters[azienda][id][$eq]=${aziendaId}&populate[candidatures][populate]=utente,feedback`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${jwt}` } });
        if (!res.ok) {
          console.error("Errore fetch offerte");
          setLoading(false);
          return;
        }
        const json = await res.json();
        // json.data è array di offerte
        // Mappiamo in OffertaLavoro[] semplificato
        const offerteData = json.data.map((off: any) => ({
          id: off.id,
          Titolo: off.attributes.Titolo,
          Descrizione: off.attributes.Descrizione,
          candidatures: (off.attributes.candidatures?.data || []).map((cand: any) => ({
            id: cand.id,
            utente: {
              id: cand.attributes.utente?.data?.id,
              username: cand.attributes.utente?.data?.attributes.username,
              email: cand.attributes.utente?.data?.attributes.email,
            },
            curriculumUrl: cand.attributes.curriculumUrl, // adatta se diverso
            feedback: (cand.attributes.feedback?.data || []).map((fb: any) => ({
              id: fb.id,
              valutazione: fb.attributes.valutazione,
              commento: fb.attributes.commento,
            })),
          })),
        }));

        setOfferte(offerteData);
      } catch (e) {
        console.error("Errore fetch offerte con candidature", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferteConCandidature();
  }, [aziendaId, jwt]);

  if (loading) return <div>Caricamento…</div>;

  if (!aziendaId) return <div>Azienda non trovata o non autenticato</div>;

  return (
    <div>
      <h2>Candidature per le tue offerte</h2>
      {offerte.length === 0 && <p>Nessuna offerta trovata.</p>}
      {offerte.map((off) => (
        <div key={off.id} style={{ border: "1px solid #ccc", margin: "1rem 0", padding: "1rem" }}>
          <h3>{off.Titolo}</h3>
          <p>{off.Descrizione}</p>

          <h4>Candidature:</h4>
          {off.candidatures.length === 0 && <p>Nessuna candidatura</p>}
          {off.candidatures.map((cand) => (
            <div key={cand.id} style={{ marginBottom: "1rem", paddingLeft: "1rem", borderLeft: "3px solid #888" }}>
              <p>
                <strong>Candidato:</strong> {cand.utente.username} ({cand.utente.email})
              </p>
              {cand.curriculumUrl && (
                <p>
                  <a href={cand.curriculumUrl} target="_blank" rel="noreferrer">
                    Visualizza CV
                  </a>
                </p>
              )}
              {cand.feedback && cand.feedback.length > 0 ? (
                <div>
                  <strong>Feedback:</strong>
                  <ul>
                    {cand.feedback.map((fb) => (
                      <li key={fb.id}>
                        Valutazione: {fb.valutazione} - {fb.commento}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Nessun feedback</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CandidatureOfferteAzienda;
