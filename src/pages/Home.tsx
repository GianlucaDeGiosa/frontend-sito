import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>
          Trova il tuo prossimo lavoro con <span className="highlight">BugBusters Recruit</span>
        </h1>
        <p className="subtitle">
          Connetti talenti e aziende nel modo più intelligente. La tua carriera parte da qui.
        </p>
        <div className="home-buttons">
          <button onClick={() => navigate("/register")}>Registrati ora</button>
          <button className="outline" onClick={() => navigate("/login")}>Accedi</button>
        </div>
      </header>

      <section className="home-grid">
        <div className="home-card left-align">
          <div className="icon">👩‍💼</div>
          <h3 className="card-title-center">Per i Candidati</h3>
          <ul>
            <li>Crea il tuo profilo professionale completo</li>
            <li>Trova opportunità di lavoro su misura per te</li>
            <li>Candidati con un solo click</li>
            <li>Ricevi feedback e proposte personalizzate</li>
            <li>Segui lo stato delle tue candidature</li>
          </ul>
          <button onClick={() => navigate("/register?role=candidate")}>Area Candidati</button>
        </div>

        <div className="home-card left-align">
          <div className="icon">🏢</div>
          <h3 className="card-title-center">Per le Aziende</h3>
          <ul>
            <li>Pubblica offerte di lavoro dettagliate</li>
            <li>Ottieni candidati compatibili per ogni offerta lavorativa</li>
            <li>Fornisci materiale formativo per i candidati</li>
            <li>Comunica la tua cultura aziendale</li>
            <li>Fornisci feedback alle candidature dei candidati</li>
          </ul>
          <button onClick={() => navigate("/register?role=company")}>Area Aziende</button>
        </div>
      </section>

      {/* Sezione Statistiche */}
      <section className="home-stats">
        <h2>Perché scegliere BugBusters Recruit?</h2>
        <p className="subtitle">La piattaforma che sta trasformando il Recruiting in Italia</p>
        <div className="stats-grid">
          <div>
            <h3>50K+</h3>
            <p>Candidati attivi</p>
          </div>
          <div>
            <h3>1200+</h3>
            <p>Aziende partner</p>
          </div>
          <div>
            <h3>95%</h3>
            <p>Tasso di successo</p>
          </div>
        </div>
      </section>

      {/* Sezione Call to Action */}
      <section className="home-cta">
        <h2>Pronto a trasformare il tuo futuro professionale?</h2>
        <p className="subtitle">Unisciti a migliaia di professionisti che hanno già trovato il lavoro dei loro sogni con BugBusters Recruit.</p>
        <button
          className="home-cta-button"
          onClick={() => {
            const isLogged = localStorage.getItem("userRole");
            navigate(isLogged ? "/login" : "/register");
          }}
        >
          Inizia ora →
        </button>
      </section>
    </div>
  );
};

export default Home;