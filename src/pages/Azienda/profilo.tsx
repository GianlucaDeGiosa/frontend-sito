import React, { useEffect, useState } from "react";
import "./profilo.css";
import { Link } from "react-router-dom";

const ProfiloAzienda: React.FC = () => {
  const [Azienda, setAzienda] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingDescrizione, setEditingDescrizione] = useState(false);
  const [editingCultura, setEditingCultura] = useState(false);
  const [cultura, setCultura] = useState<string>("");
  const [descrizione, setDescrizione] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<any[]>([]);

  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAzienda = async () => {
      try {
        const res = await fetch(
          //`http://localhost:1338/api/users/${userId}?populate=azienda`,
          `http://localhost:1338/api/users/${userId}?populate[azienda][populate]=Logo`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const data = await res.json();
        setAzienda(data);
        setCultura(data.azienda?.Cultura || "");
        setDescrizione(data.azienda?.Descrizione || "");
        setLogoUrl(data.azienda?.Logo || []);
        setLoading(false);
        console.log("Dati utente:", data);
      } catch (err) {
        console.error("Errore caricamento dati utente:", err);
      }
    };

    fetchAzienda();
  }, [userId, jwt]);

  const handleDescrizioneChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescrizione(e.target.value);
  };

  const handleSalvaDescrizione = async () => {
    if (!Azienda?.id) {
      console.error("ID azienda mancante");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:1338/api/aziendas/${azienda.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: { Descrizione: descrizione },
          }),
        }
      );

      if (res.ok) {
        setAzienda((prev: any) => ({
          ...prev,
          Descrizione: descrizione,
        }));
        setEditingDescrizione(false);
      } else {
        console.error("Errore durante il salvataggio dei dati:", await res.text());
      }
    } catch (error) {
      console.error("Errore nel salvataggio della descrizione:", error);
    }
  };

  const handleCulturaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCultura(e.target.value);
  };

  const handleSalvaCultura = async () => {
    if (!Azienda?.id) {
      console.error("ID azienda mancante");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:1338/api/aziendas/${azienda.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: { Cultura: cultura },
          }),
        }
      );

      if (res.ok) {
        setAzienda((prev: any) => ({
          ...prev,
          Cultura: cultura,
        }));
        setEditingCultura(false);
      } else {
        console.error("Errore durante il salvataggio dei dati:", await res.text());
      }
    } catch (error) {
      console.error("Errore nel salvataggio della cultura aziendale:", error);
    }
  };

  const handleUploadLogo = async (file: File) => {
    if (!file || !azienda?.id) return;

    try {
      // ✅ 1. Se esiste un logo precedente, lo eliminiamo
      if (logoUrl.length > 0) {
        const deletePromises = logoUrl.map((file) =>
          fetch(
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
      formData.append("ref", "api::azienda.azienda");
      formData.append("refId", azienda.id);
      formData.append("field", "Logo");

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
        setLogoUrl(uploaded);
        alert("Logo caricato con successo.");
      } else {
        console.error("Errore nell’upload:", await res.text());
      }
    } catch (err) {
      console.error("Errore imprevisto:", err);
    }

  };


  if (loading) return <div>Caricamento...</div>;
  if (!Azienda) return <div>Errore nel caricamento dati.</div>;

  const azienda = Azienda.azienda;

  return (
    <div className="admin-profilo">
      <aside className="sidebar">
        <h2 className="logo" style={{ margin: 0 }}>{Azienda.azienda?.NomeAzienda || "Utente"}</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-azienda">Dashboard</Link></li>
            <li><Link className="no-style-link active" to="/dashboard-azienda/profilo-azienda">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/materiale-formativo">Materiali Formativi</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/offerte">Gestione Posizioni</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/candidature-ricevute">Candidature Ricevute</Link></li>
          </ul>

        </nav>
      </aside>

      <main className="profilo-azienda">
        <h2>Il tuo profilo</h2>

        <div className="profilo-dettaglio">
         
          <strong>Logo:</strong><br />

          {logoUrl.length > 0 ? (
            <div className="cv-link">
              <button
                className="primary-button"
                onClick={() =>
                  window.open(
                    logoUrl[0].url.startsWith("http") ? logoUrl[0].url : `http://localhost:1338${logoUrl[0].url}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Visualizza Logo
              </button>
            </div>
          ) : (
            <div>Non caricato</div>
          )}


          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadLogo(file);
            }}
          />
        </div>


        <div className="profilo-riga">
          <div className="profilo-dettaglio"><strong>Nome Azienda:</strong> {azienda?.NomeAzienda}</div>
          <div className="profilo-dettaglio"><strong>Email:</strong> {Azienda.email}</div>
        </div>

        <div className="profilo-riga">
          <div className="profilo-dettaglio"><strong>Settore:</strong> {azienda?.Settore}</div>
          <div className="profilo-dettaglio"><strong>Partita IVA:</strong> {azienda?.PartitaIva}</div>
        </div>

        <div className="profilo-dettaglio"><strong>Sede Legale:</strong> {azienda?.SedeLegale}</div>

        <div className="profilo-dettaglio">
          <strong>Cultura Aziendale:</strong><br />
          {editingCultura ? (
            <>
              <textarea
                value={cultura}
                onChange={handleCulturaChange}
                rows={5}
              />
              <br />
              <button className="salva-btn" onClick={handleSalvaCultura}>Salva</button>
            </>
          ) : (
            <>
              {cultura || "Non specificato"}{" "}
              <button className="modifica-btn" onClick={() => setEditingCultura(true)}>Modifica</button>
            </>
          )}
        </div>

        <div className="profilo-dettaglio">
          <strong>Descrizione:</strong><br />
          {editingDescrizione ? (
            <>
              <textarea
                value={descrizione}
                onChange={handleDescrizioneChange}
                rows={5}
              />
              <br />
              <button className="salva-btn" onClick={handleSalvaDescrizione}>Salva</button>
            </>
          ) : (
            <>
              {descrizione || "Non specificato"}{" "}
              <button className="modifica-btn" onClick={() => setEditingDescrizione(true)}>Modifica</button>
            </>
          )}
        </div>

      </main>
    </div>
  );
};
export default ProfiloAzienda;
