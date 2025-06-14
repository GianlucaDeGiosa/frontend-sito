import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./profilo.css";

const ProfiloCandidato = () => {
  const [candidato, setCandidato] = useState<any>(null);
  const [telefono, setTelefono] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const jwt = localStorage.getItem("jwt");
  const documentId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCandidato = async () => {
      try {
        const res = await fetch(
          `https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${documentId}?populate=candidato.CurriculumVitae`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const data = await res.json();

        if (data.candidato?.CurriculumVitae) {
          setCurriculum(data.candidato.CurriculumVitae);
        }

        setCandidato(data.candidato);
        setTelefono(data.candidato?.NumeroTelefono?.toString() || "");
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
        `https://lovable-horses-1f1c111d86.strapiapp.com/api/candidatoes/${candidato.documentId}`,
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

  const handleUploadCurriculum = async (file: File) => {
    if (!file || !candidato?.id) return;

    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", "api::candidato.candidato");
    formData.append("refId", candidato.documentId);
    formData.append("field", "CurriculumVitae");

    try {
      const res = await fetch(
        "https://lovable-horses-1f1c111d86.strapiapp.com/api/upload",
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
        setCurriculum((prev) => [...prev, ...uploaded]);
        alert("Curriculum caricato con successo.");
      } else {
        console.error("Errore nell’upload:", await res.text());
      }
    } catch (err) {
      console.error("Errore imprevisto:", err);
    }
  };

  if (!candidato) return <div className="profilo-candidato">Caricamento...</div>;

  const userEmail = JSON.parse(localStorage.getItem("user") || "{}").email;

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte">Offerte</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback</Link></li>
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
            <strong>Telefono:</strong>{candidato.NumeroTelefono}
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
                    <a href={file.url.startsWith("http") ? file.url : `https://lovable-horses-1f1c111d86.strapiapp.com${file.url}`} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
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
