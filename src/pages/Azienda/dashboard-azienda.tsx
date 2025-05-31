import React from "react";
import "./dashboard-azienda.css";

const DashboardAzienda = () => {
const offerte = [
{
id: 1,
titolo: "Frontend Developer",
sede: "Milano",
tipoContratto: "Indeterminato",
},
{
id: 2,
titolo: "Backend Developer",
sede: "Remoto",
tipoContratto: "Determinato",
},
];

const candidatiSuggeriti = [
{ id: 1, nome: "Mario Rossi", competenze: ["React", "TypeScript"] },
{ id: 2, nome: "Luca Bianchi", competenze: ["Java", "Spring"] },
];

return (
<div className="dashboard-container">
<h1 className="dashboard-title">Benvenuto nella Dashboard Aziendale</h1>
  <section className="dashboard-section">
    <h2>Le tue Offerte di Lavoro</h2>
    <div className="card-grid">
      {offerte.map((offerta) => (
        <div key={offerta.id} className="card">
          <h3>{offerta.titolo}</h3>
          <p><strong>Sede:</strong> {offerta.sede}</p>
          <p><strong>Tipo Contratto:</strong> {offerta.tipoContratto}</p>
          <button className="primary-button">Visualizza</button>
        </div>
      ))}
    </div>
  </section>

  <section className="dashboard-section">
    <h2>Materiale Formativo</h2>
    <div className="card upload-box">
      <p>Carica materiale formativo per i candidati</p>
      <input type="file" />
      <button className="primary-button">Carica</button>
    </div>
  </section>

  <section className="dashboard-section">
    <h2>Candidati Suggeriti</h2>
    <div className="card-grid">
      {candidatiSuggeriti.map((candidato) => (
        <div key={candidato.id} className="card">
          <h3>{candidato.nome}</h3>
          <p>Competenze: {candidato.competenze.join(", ")}</p>
          <button className="primary-button">Esamina Profilo</button>
        </div>
      ))}
    </div>
  </section>
</div>
);
};

export default DashboardAzienda;