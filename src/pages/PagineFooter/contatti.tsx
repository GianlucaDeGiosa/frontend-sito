import React from "react";
import './InfoPages.css';

const Contatti = () => {
  return (
    <div className="info-container">
      <h1 className="text-3xl font-bold mb-4">Contattaci</h1>

      <p className="mb-4">
        Hai domande, proposte di collaborazione o riscontri un problema tecnico?
        Siamo a tua disposizione per offrirti supporto nel più breve tempo possibile.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">📧 Email di contatto</h2>
      <p className="mb-4">
        Puoi scriverci all'indirizzo <strong>info@bugbusters-recruit.it</strong> per:
        <ul className="list-disc list-inside mt-2">
          <li>Richieste generiche e informazioni sulla piattaforma</li>
          <li>Supporto tecnico e segnalazioni di problemi</li>
          <li>Collaborazioni istituzionali o accademiche</li>
          <li>Assistenza per candidati e aziende registrate</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">🌍 Dove ci trovi</h2>
      <p className="mb-4">
        BugBusters Recruit è un progetto digitale nato in Italia. Operiamo da remoto, ma puoi contattarci tramite i nostri canali ufficiali o fissare una call conoscitiva su richiesta.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">🔗 Social media</h2>
      <p className="mb-2">Seguici per aggiornamenti, novità sul progetto e opportunità di networking:</p>
      <ul className="list-disc list-inside">
        <li>
          <a href="https://www.linkedin.com/company/bugbusters-recruit" target="_blank" rel="noopener noreferrer">
            LinkedIn – BugBusters Recruit
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/bugbustersrecruit" target="_blank" rel="noopener noreferrer">
            Instagram – @bugbustersrecruit
          </a>
        </li>
        <li>
          <a href="https://twitter.com/bugb_recruit" target="_blank" rel="noopener noreferrer">
            Twitter – @bugb_recruit
          </a>
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">🕒 Orari di supporto</h2>
      <p className="mb-4">
        Il nostro team risponde alle richieste dal lunedì al venerdì, dalle 9:00 alle 18:00. Riceverai una risposta entro 24-48 ore lavorative.
      </p>

      <p className="italic text-sm">
        Ti ringraziamo per l’interesse verso BugBusters Recruit. Il tuo feedback è fondamentale per migliorare il nostro servizio!
      </p>
    </div>
  );
};

export default Contatti;
