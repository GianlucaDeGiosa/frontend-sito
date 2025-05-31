import React from 'react';
import './dashboard-candidato.css';
import { Link } from "react-router-dom";

const DashboardCandidato: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li>Dashboard</li>
            <li><Link to="/profilo-candidato">Profilo</Link></li>
            <li>Offerte</li>
            <li>Colloqui</li>
            <li>Feedback</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Benvenuto Mario!</h1>
          <input type="search" placeholder="Cerca..." />
        </header>

        <section className="cards">
          <div className="card">
            <h3>Competenze</h3>
            <p>12/15</p>
          </div>
          <div className="card">
            <h3>Colloqui Prenotati</h3>
            <p>3</p>
          </div>
          <div className="card">
            <h3>Offerte Salvate</h3>
            <p>6</p>
          </div>
          <div className="card">
            <h3>Feedback Ricevuti</h3>
            <p>4</p>
          </div>
        </section>

        <section className="analytics">
          <div className="chart-placeholder">
            <h3>Andamento Competenze Inserite</h3>
            <div className="chart-box">[Grafico Linea]</div>
          </div>

          <div className="chart-placeholder">
            <h3>Completamento Profilo</h3>
            <div className="chart-box">[Gauge Chart 83%]</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardCandidato;
