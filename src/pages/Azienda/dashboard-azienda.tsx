import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./dashboard-azienda.css";

interface Offerta {
  id: number;
  titolo: string;
  sede: string;
  tipoContratto: string;
}

interface CandidatoSuggerito {
  id: number;
  nome: string;
  competenze: string[];
}

const DashboardAzienda: React.FC = () => {
  // Stato per le offerte (estraibili via API)
  const [offerte, setOfferte] = useState<Offerta[]>([]);
  const [loadingOfferte, setLoadingOfferte] = useState<boolean>(true);

  // Stato per i candidati suggeriti
  const [candidatiSuggeriti, setCandidatiSuggeriti] = useState<CandidatoSuggerito[]>([]);
  const [loadingCandidati, setLoadingCandidati] = useState<boolean>(true);

  useEffect(() => {
    // Recupera le offerte pubblicate dall'azienda corrente
    axios
      .get<Offerta[]>("/api/azienda/offerte") // ➞ endpoint fittizio
      .then((res) => {
        setOfferte(res.data);
      })
      .catch((err) => {
        console.error("Errore nel recupero delle offerte:", err);
        setOfferte([]);
      })
      .finally(() => {
        setLoadingOfferte(false);
      });

    // Recupera candidati suggeriti in base al profilo aziendale
    axios
      .get<CandidatoSuggerito[]>("/api/azienda/candidati-suggeriti") // ➞ endpoint fittizio
      .then((res) => {
        setCandidatiSuggeriti(res.data);
      })
      .catch((err) => {
        console.error("Errore nel recupero dei candidati suggeriti:", err);
        setCandidatiSuggeriti([]);
      })
      .finally(() => {
        setLoadingCandidati(false);
      });
  }, []);

  return (
    <div className="dashboard-azienda-wrapper">
      {/* ASIDE: replica esatta stile DashboardCandidato (dark, sticky) */}
      <aside className="dashboard-candidato-aside">
        <div className="aside-header">
          <h2 className="aside-title">Area Azienda</h2>
        </div>
        <nav className="aside-nav">
          <ul>
            <li>
              <Link to="/dashboard-azienda" className="aside-link active">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard-azienda/profilo" className="aside-link active">
                Profilo
              </Link>
            </li>
            <li>
              <Link to="/dashboard-azienda/offerte" className="aside-link">
                Le mie Offerte
              </Link>
            </li>
            <li>
              <Link to="/dashboard-azienda/candidati" className="aside-link">
                Candidati
              </Link>
            </li>
            <li>
              <Link to="/dashboard-azienda/materiale" className="aside-link">
                Materiale Formativo
              </Link>
            </li>
            <li>
              <Link to="/dashboard-azienda/impostazioni" className="aside-link">
                Impostazioni
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* CONTENUTO PRINCIPALE */}
      <div className="dashboard-azienda-container">
        <h1 className="dashboard-azienda-title">Dashboard Azienda</h1>

        {/* Sezione Offerte */}
        <section className="dashboard-azienda-section">
          <h2>Le Tue Offerte</h2>
          {loadingOfferte ? (
            <p>Caricamento offerte in corso...</p>
          ) : offerte.length > 0 ? (
            <div className="card-grid">
              {offerte.map((offerta) => (
                <div key={offerta.id} className="card">
                  <h3>{offerta.titolo}</h3>
                  <p>
                    <strong>Sede:</strong> {offerta.sede}
                  </p>
                  <p>
                    <strong>Tipo Contratto:</strong> {offerta.tipoContratto}
                  </p>
                  <button className="primary-button">Visualizza</button>
                </div>
              ))}
            </div>
          ) : (
            <p>Non hai ancora pubblicato offerte.</p>
          )}
        </section>

        {/* Sezione Caricamento Materiale Formativo */}
        <section className="dashboard-azienda-section">
          <h2>Materiale Formativo</h2>
          <div className="card upload-box">
            <p>Carica materiale formativo per i candidati</p>
            <input type="file" />
            <button className="primary-button">Carica</button>
          </div>
        </section>

        {/* Sezione Candidati Suggeriti */}
        <section className="dashboard-azienda-section">
          <h2>Candidati Suggeriti</h2>
          {loadingCandidati ? (
            <p>Caricamento candidati in corso...</p>
          ) : candidatiSuggeriti.length > 0 ? (
            <div className="card-grid">
              {candidatiSuggeriti.map((candidato) => (
                <div key={candidato.id} className="card">
                  <h3>{candidato.nome}</h3>
                  <p>Competenze: {candidato.competenze.join(", ")}</p>
                  <button className="primary-button">Esamina Profilo</button>
                </div>
              ))}
            </div>
          ) : (
            <p>Nessun candidato suggerito per il momento.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardAzienda;