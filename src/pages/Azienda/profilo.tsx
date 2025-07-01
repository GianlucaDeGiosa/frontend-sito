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
  const [logoUrl, setLogoUrl] = useState("");

  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAzienda = async () => {
      try {
        const res = await fetch(
          //`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}?populate=azienda`,
          `http://localhost:1338/api/users/${userId}?populate=azienda`,
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
        setLogoUrl(data.azienda?.Logo || "");
        setLoading(false);
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
        //`https://lovable-horses-1f1c111d86.strapiapp.com/api/aziendas/${azienda.documentId}`,
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
        //`https://lovable-horses-1f1c111d86.strapiapp.com/api/aziendas/${azienda.documentId}`,
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
  const formData = new FormData();
  formData.append("files", file);
  formData.append("ref", "api::azienda.azienda");
  formData.append("refId", Azienda.azienda.id);
  formData.append("field", "Logo");

  try {
    const uploadRes = await fetch("http://localhost:1338/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      console.error("Errore upload logo:", await uploadRes.text());
      return;
    }

    const uploaded = await uploadRes.json();
    const fileId = uploaded[0]?.id;

    // Aggiorna il campo Logo dell'azienda con l'ID del file caricato
    const updateRes = await fetch(
      `http://localhost:1338/api/aziendas/${Azienda.azienda.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: { Logo: fileId },
        }),
      }
    );

    if (!updateRes.ok) {
      console.error("Errore aggiornamento campo logo:", await updateRes.text());
      return;
    }

    // Ricarica l’URL completo del logo
    const newLogoUrl = uploaded[0].url.startsWith("http")
      ? uploaded[0].url
      : `http://localhost:1338${uploaded[0].url}`;
    setLogoUrl(newLogoUrl);
  } catch (err) {
    console.error("Errore generale durante upload e aggiornamento logo:", err);
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
            <li><Link className="no-style-link" to="/dashboard-azienda/profilo-azienda">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-azienda/materiale-formativo">Materiale Formativi Aziendali</Link></li>
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
          {logoUrl ? <img src={logoUrl} alt="Logo Azienda" className="logo-img" /> : "Non caricato"}
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadLogo(file);
          }} />
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
