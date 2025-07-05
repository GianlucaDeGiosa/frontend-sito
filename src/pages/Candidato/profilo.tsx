import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./profilo.css";

const ProfiloCandidato = () => {
  const [candidato, setCandidato] = useState<any>(null);
  const [telefono, setTelefono] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [livelloEsperienza, setLivelloEsperienza] = useState<string>("");
  const jwt = localStorage.getItem("jwt");
  const documentId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCandidato = async () => {
      try {
        const res = await fetch(
          // `http://localhost:1338/api/users/${documentId}?populate=candidato.CurriculumVitae`,
          `http://localhost:1338/api/users/${documentId}?populate=candidato.CurriculumVitae`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const data = await res.json();

        setUserEmail(data.email || "");

        if (data.candidato?.CurriculumVitae) {
          setCurriculum(data.candidato.CurriculumVitae);
        }

        setCandidato(data.candidato);
        setTelefono(data.candidato?.NumeroTelefono?.toString() || "");
        setLivelloEsperienza(data.candidato?.LivelloEsperienza || "");
      } catch (error) {
        console.error("Errore durante il recupero del profilo:", error);
      }
    };

    fetchCandidato();
  }, [jwt, documentId]);

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefono(e.target.value);
  };

  const handleSalvaTelefono = async () => {
    if (!candidato?.id) {
      console.error("ID candidato mancante");
      return;
    }

    try {
      const res = await fetch(
        // `http://localhost:1338/api/candidatoes/${candidato.id}`,
        `http://localhost:1338/api/candidatoes/${candidato.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: { NumeroTelefono: telefono },
          }),
        }
      );

      if (res.ok) {
        setCandidato((prev: any) => ({
          ...prev,
          NumeroTelefono: telefono,
        }));
        setEditing(false);
      } else {
        console.error("Errore durante il salvataggio dei dati:", await res.text());
      }
    } catch (error) {
      console.error("Errore nel salvataggio del numero di telefono:", error);
    }
  };
  const handleLivelloEsperienzaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLivelloEsperienza(e.target.value);
  };

  const handleSalvaEsperienza = async () => {
    if (!candidato?.id) {
      console.error("ID candidato mancante");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:1338/api/candidatoes/${candidato.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              LivelloEsperienza: livelloEsperienza,
            },
          }),
        }
      );

      if (res.ok) {
        setCandidato((prev: any) => ({
          ...prev,
          LivelloEsperienza: livelloEsperienza,
        }));
        alert("Livello esperienza salvato con successo");
      } else {
        console.error("Errore durante il salvataggio del livello esperienza:", await res.text());
      }
    } catch (error) {
      console.error("Errore nel salvataggio del livello esperienza:", error);
    }
  };

  const handleUploadCurriculum = async (file: File) => {
    if (!file || !candidato?.id) return;

    try {
      // ✅ 1. Se esiste un CV precedente, lo eliminiamo
      if (curriculum.length > 0) {
        const deletePromises = curriculum.map((file) =>
          fetch(
            // `http://localhost:1338/api/upload/files/${file.id}`,
            `http://localhost:1338/api/upload/files/${file.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          )
        );
        await Promise.all(deletePromises);
      }

      // ✅ 2. Carichiamo il nuovo file
      const formData = new FormData();
      formData.append("files", file);
      formData.append("ref", "api::candidato.candidato");
      formData.append("refId", candidato.id);
      formData.append("field", "CurriculumVitae");

      const res = await fetch(
        "http://localhost:1338/api/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        const uploaded = await res.json();
        setCurriculum(uploaded);
        alert("Curriculum caricato con successo.");
      } else {
        console.error("Errore nell’upload:", await res.text());
      }
    } catch (err) {
      console.error("Errore imprevisto:", err);
    }
  };


  if (!candidato) return <div className="profilo-candidato">Caricamento...</div>;

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link active" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte-lavoro">Offerte di Lavoro</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="profilo-candidato">
          <h2>Il tuo profilo</h2>
          <div className="profilo-dettaglio"><strong>Nome:</strong> {candidato.Nome}</div>
          <div className="profilo-dettaglio"><strong>Cognome:</strong> {candidato.Cognome}</div>
          <div className="profilo-dettaglio"><strong>Data di Nascita:</strong> {candidato.DataNascita}</div>
          <div className="profilo-dettaglio"><strong>Email:</strong> {userEmail}</div>
          <div className="profilo-dettaglio">
            <strong>Telefono:</strong>
            {editing ? (
              <>
                <input
                  type="number"
                  value={telefono}
                  onChange={handleTelefonoChange}
                  className="telefono-input"
                />
                <button className="salva-btn" onClick={handleSalvaTelefono}>Salva</button>
              </>
            ) : (
              <>
                {telefono || "Non specificato"}{" "}
                <button className="modifica-btn" onClick={() => setEditing(true)}>Modifica</button>
              </>
            )}
          </div>

          <div className="profilo-dettaglio">
            <strong>Livello Esperienza:</strong>
            <select value={livelloEsperienza} onChange={handleLivelloEsperienzaChange}>
              <option value="">Seleziona</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
            <button className="salva-btn" onClick={handleSalvaEsperienza}>Salva</button>
          </div>


          <div className="profilo-dettaglio">
            <strong>Curriculum Vitae:</strong>
            <input

              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadCurriculum(file);
              }}
            />
            {curriculum?.length > 0 && (
              <ul>
                {curriculum.map((file) => (
                  <li key={file.id}>
                    <button
                      className="primary-button"
                      onClick={() =>
                        window.open(
                          file.url.startsWith("http")
                            ? file.url
                            : `http://localhost:1338${file.url}`,
                          "_blank",
                          "noopener,noreferrer")}>
                      {file.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfiloCandidato;
