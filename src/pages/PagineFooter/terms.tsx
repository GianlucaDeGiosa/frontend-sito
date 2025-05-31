import React from "react";
import './InfoPages.css';

const Terms = () => {
  return (
    <div className="info-container">
      <h1 className="text-3xl font-bold mb-4">Termini di Servizio</h1>

      <p className="mb-4">
        L'accesso e l'utilizzo della piattaforma BugBusters Recruit comportano l'accettazione integrale dei presenti Termini di Servizio. Gli utenti si impegnano a utilizzare il sistema in modo conforme alle leggi vigenti e ai principi di correttezza, trasparenza e rispetto reciproco.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Registrazione e Accesso</h2>
      <p className="mb-4">
        Per accedere a determinate funzionalità della piattaforma, è necessario creare un account personale. L'utente si impegna a fornire informazioni veritiere, aggiornate e complete durante la registrazione. L'accesso è strettamente personale e non può essere condiviso con terzi.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Responsabilità dell'Utente</h2>
      <p className="mb-4">
        L’utente è responsabile di tutte le attività svolte con il proprio account. È vietato utilizzare la piattaforma per:
        <ul className="list-disc list-inside mt-2">
          <li>Diffondere contenuti falsi, diffamatori o offensivi</li>
          <li>Effettuare tentativi di accesso non autorizzato ai sistemi</li>
          <li>Utilizzare strumenti automatizzati per raccogliere dati</li>
          <li>Svolgere attività di spam o promozione non richiesta</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Sospensione e Cancellazione Account</h2>
      <p className="mb-4">
        BugBusters Recruit si riserva il diritto di sospendere o cancellare un account utente in caso di violazione dei presenti termini, comportamenti illeciti o contrari ai valori etici della piattaforma, senza preavviso e senza obbligo di giustificazione.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Diritti di Proprietà Intellettuale</h2>
      <p className="mb-4">
        Tutti i contenuti della piattaforma, inclusi loghi, testi, grafica e codice, sono di proprietà di BugBusters Recruit o concessi in licenza, e sono protetti dalle leggi sul diritto d'autore. Ne è vietata la riproduzione o distribuzione non autorizzata.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitazione di Responsabilità</h2>
      <p className="mb-4">
        La piattaforma è fornita "così com'è". Pur impegnandosi a garantire la disponibilità del servizio, BugBusters Recruit non è responsabile per:
        <ul className="list-disc list-inside mt-2">
          <li>Eventuali interruzioni temporanee del servizio</li>
          <li>Perdite di dati causate da terze parti o problemi tecnici</li>
          <li>Eventuali danni derivanti da un uso scorretto della piattaforma</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Modifiche ai Termini</h2>
      <p className="mb-4">
        BugBusters Recruit si riserva il diritto di modificare in qualsiasi momento i presenti Termini di Servizio. Gli utenti verranno informati tramite email o notifica sul sito. L’uso continuativo della piattaforma dopo le modifiche costituirà accettazione implicita delle nuove condizioni.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Legge Applicabile</h2>
      <p className="mb-4">
        I presenti Termini sono regolati dalla legge italiana. In caso di controversie, il foro competente sarà quello di residenza del titolare della piattaforma, salvo diversa disposizione di legge.
      </p>
    </div>
  );
};

export default Terms;
