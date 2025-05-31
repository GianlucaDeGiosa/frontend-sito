import React, { useState } from "react";
import "./profilo.css";

const Profilo = () => {
  const [user, setUser] = useState({
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@example.com",
    telefono: "+39 123 456 7890",
    ruolo: "Candidato",
    immagine: "https://i.pravatar.cc/200?img=3",
    candidature: 14,
    offerteSalvate: 8,
  });

  const handleModifica = () => {
    alert("Funzionalità di modifica in arrivo!");
  };

  return (
    <div className="profilo-container">
      <header className="profilo-header">
        <h1>IL TUO PROFILO</h1>
        <p className="profilo-subtitle">Gestisci le tue informazioni personali</p>
      </header>

      <section className="profilo-main">
        <div className="profilo-left">
          <div className="image-wrapper">
            <img src={user.immagine} alt={`${user.nome} ${user.cognome}`} className="profilo-image" />
            <button className="upload-btn">📷 Cambia immagine</button>
          </div>
          <button className="profilo-button" onClick={handleModifica}>Modifica dati</button>
        </div>

        <div className="profilo-right">
          <h2>{user.nome} {user.cognome}</h2>
          <p className="profilo-ruolo">{user.ruolo}</p>

          <div className="info-grid">
            <div>
              <span className="info-label">📧 Email</span>
              <p>{user.email}</p>
            </div>
            <div>
              <span className="info-label">📞 Telefono</span>
              <p>{user.telefono}</p>
            </div>
          </div>

          <div className="extra-info">
            <div className="extra-card">
              <span>📝</span>
              <div>
                <p className="extra-number">{user.candidature}</p>
                <p>Candidature inviate</p>
              </div>
            </div>
            <div className="extra-card">
              <span>⭐</span>
              <div>
                <p className="extra-number">{user.offerteSalvate}</p>
                <p>Offerte salvate</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profilo;
