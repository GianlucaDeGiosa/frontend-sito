import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./candidatiSuggeriti.css";

type Candidato = {
  id: number;
  Nome: string;
  Cognome: string;
  LivelloEsperienza?: string;
  competenzas?: { id: number; Nome: string }[];
  Attitudini?: { attitudine: string }[];
  Preferenze?: { preferenza: string }[];
};

const CandidatiSuggeriti: React.FC = () => {
  const { offertaId } = useParams<{ offertaId: string }>();
  const [candidati, setCandidati] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [statusMap, setStatusMap] = useState<Record<number,string>>({});

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchCandidati = async () => {
      try {
        const res = await fetch(
          `http://localhost:1338/api/offerta-lavoros/${offertaId}?populate[candidati][populate]=competenzas,Attitudini,Preferenze`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const json = await res.json();
        const raw = json.data.attributes.candidati.data;
        const mapped = raw.map((c: any) => ({
          id: c.id,
          ...c.attributes,
        }));
        // Qui si potrebbe calcolare la compatibilità
        setCandidati(mapped);
      } catch (err: any) {
        console.error(err);
        setErrore("Impossibile caricare i candidati.");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidati();
  }, [offertaId, jwt]);

  const handleChangeStatus = (id: number, status: string) => {
    setStatusMap(prev => ({ ...prev, [id]: status }));
    // Qui potresti fare fetch PATCH per salvare la valutazione nel backend
  };

  if (loading) return <div>Caricamento candidati...</div>;
  if (errore) return <div style={{color:"red"}}>{errore}</div>;
  if (candidati.length === 0) {
    return (
      <div>
        <p>Nessun candidato compatibile.</p>
        <p>Prova ad ampliare i criteri o aggiungere competenze alla posizione.</p>
      </div>
    );
  }

  return (
    <div className="candidati-suggeriti">
      <h2>Candidati compatibili per Offerta #{offertaId}</h2>
      <ul className="lista-candidati">
        {candidati.map(c => (
          <li key={c.id} className="card-candidato">
            <h3>{c.Nome} {c.Cognome}</h3>
            <p><strong>Esperienza:</strong> {c.LivelloEsperienza || "N/D"}</p>
            {c.competenzas && (
              <p><strong>Competenze:</strong> {c.competenzas.map(k=>k.Nome).join(", ")}</p>
            )}
            {c.Attitudini && (
              <p><strong>Attitudini:</strong> {c.Attitudini.map(a=>a.attitudine).join(", ")}</p>
            )}
            {c.Preferenze && (
              <p><strong>Preferenze:</strong> {c.Preferenze.map(p=>p.preferenza).join(", ")}</p>
            )}
            <div className="azioni-candidato">
              <button
                onClick={() => handleChangeStatus(c.id, "in valutazione")}
                disabled={statusMap[c.id] === "in valutazione"}
              >
                {statusMap[c.id] === "in valutazione" ? "✅ In valutazione" : "Metti in valutazione"}
              </button>
              <button
                onClick={() => handleChangeStatus(c.id, "idoneo")}
                disabled={statusMap[c.id] === "idoneo"}
              >
                {statusMap[c.id] === "idoneo" ? "✅ Idoneo" : "Marca come idoneo"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidatiSuggeriti;
