import { useEffect, useState } from "react";
import "./attitudiniPreferenze.css";
import { Link } from "react-router-dom";

const AttitudiniPreferenze = () => {
  const [jwt, setJwt] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [candidatoId, setCandidatoId] = useState<number | null>(null);

  const [attitudini, setAttitudini] = useState<string>("");
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [newSoftSkill, setNewSoftSkill] = useState<string>("");

  const [ambiente, setAmbiente] = useState<string>("Remoto");
  const [contratto, setContratto] = useState<string>("Determinato");
  const [benefit, setBenefit] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState<string>("");

  // Carica jwt e userId da localStorage e dopo fetch candidatoId
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = localStorage.getItem("userId");

    if (token && user) {
      setJwt(token);
      setUserId(Number(user));
    }
  }, []);

  // Quando jwt e userId sono pronti, carica candidatoId
  useEffect(() => {
    const fetchCandidato = async () => {
      if (!userId || !jwt) return;

      const res = await fetch(
        //`https://lovable-horses-1f1c111d86.strapiapp.com/api/candidatoes?filters[users_permissions_user][id][$eq]=${userId}`,
        `http://localhost:1338/api/candidatoes?filters[users_permissions_user][id][$eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const data = await res.json();
      if (data.data.length > 0) {
        const candidato = data.data[0];
        setCandidatoId(candidato.id);

        // CARICA DATI SALVATI
        if (candidato.attributes) {
          // Adatta in base a come Strapi restituisce i dati
          const att = candidato.attributes.Attitudini?.[0];
          const pref = candidato.attributes.Preferenze?.[0];

          setAttitudini(att?.Descrizione || "");

          // SoftSkills come array di oggetti con nome
          if (att?.SoftSkill) {
            setSoftSkills(att.SoftSkill.map((s: any) => s.nome));
          }

          setAmbiente(pref?.AmbienteLavorativo || "Remoto");
          setContratto(pref?.TipologiaContratto || "Determinato");

          if (pref?.Benefit) {
            setBenefit(pref.Benefit.map((b: any) => b.nome));
          }
        }
      }
    };

    fetchCandidato();
  }, [userId, jwt]);

  const addSoftSkill = () => {
    if (newSoftSkill.trim() !== "") {
      setSoftSkills([...softSkills, newSoftSkill.trim()]);
      setNewSoftSkill("");
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim() !== "") {
      setBenefit([...benefit, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // IMPORTANTISSIMO

    if (!jwt || !candidatoId) return;

    try {
      const res = await fetch(
        //`https://lovable-horses-1f1c111d86.strapiapp.com/api/candidatoes/${candidatoId}`,
        `http://localhost:1338/api/candidatoes/${candidatoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              Attitudini: [
                {
                  Descrizione: attitudini,
                  SoftSkill: softSkills.map((s) => ({ nome: s })),
                },
              ],
              Preferenze: [
                {
                  AmbienteLavorativo: ambiente,
                  TipologiaContratto: contratto,
                  Benefit: benefit.map((b) => ({ nome: b })),
                },
              ],
            },
          }),
        }
      );

      const result = await res.json();
      console.log("Risposta Strapi:", result);
      if (!res.ok) {
        alert("Errore durante il salvataggio");
      } else {
        alert("Preferenze salvate con successo!");
      }
    } catch (err) {
      console.error("Errore di rete:", err);
      alert("Errore di rete durante il salvataggio");
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/preferenze">Attitudini e Preferenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte-suggerite">Offerte di Lavoro</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
    <div className="attitudini-container">
      <h2>Attitudini e Preferenze</h2>

      <form className="attitudini-form" onSubmit={handleSubmit}>
        <label>Descrizione Attitudini:</label>
        <textarea value={attitudini} onChange={(e) => setAttitudini(e.target.value)} />

        <label>Soft Skills:</label>
        <div className="input-group">
          <input
            type="text"
            value={newSoftSkill}
            onChange={(e) => setNewSoftSkill(e.target.value)}
          />
          <button onClick={addSoftSkill} type="button">
            Aggiungi
          </button>
        </div>
        <ul className="list-display">
          {softSkills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <label>Ambiente di Lavoro:</label>
        <select value={ambiente} onChange={(e) => setAmbiente(e.target.value)}>
          <option value="Remoto">Remoto</option>
          <option value="Ibrido">Ibrido</option>
          <option value="In sede">In sede</option>
        </select>

        <label>Tipologia di Contratto:</label>
        <select value={contratto} onChange={(e) => setContratto(e.target.value)}>
          <option value="Determinato">Determinato</option>
          <option value="Indeterminato">Indeterminato</option>
          <option value="Apprendistato">Apprendistato</option>
          <option value="In stage">In stage</option>
          <option value="Part-Time">Part-Time</option>
        </select>

        <label>Benefit desiderati:</label>
        <div className="input-group">
          <input
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
          />
          <button onClick={addBenefit} type="button">
            Aggiungi
          </button>
        </div>
        <ul className="list-display">
          {benefit.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <button type="submit" className="save-button">
          Salva Preferenze
        </button>
      </form>
    </div>
    </main>
    </div>
  );
};

export default AttitudiniPreferenze;
