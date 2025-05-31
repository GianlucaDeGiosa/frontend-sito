import React from "react";
import './InfoPages.css';

const Privacy = () => {
  return (
    <div className="info-container">
      <h1 className="text-3xl font-bold mb-4">Informativa sulla Privacy</h1>

      <p className="mb-4">
        BugBusters Recruit tutela la riservatezza dei dati personali degli utenti e garantisce che il loro trattamento avvenga nel rispetto del Regolamento UE 2016/679 (GDPR). La presente informativa descrive le modalità di raccolta, utilizzo e protezione dei dati forniti dagli utenti durante l’utilizzo della piattaforma.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Titolare del Trattamento</h2>
      <p className="mb-4">
        Il titolare del trattamento dei dati personali è BugBusters Recruit. Per qualsiasi richiesta in merito alla protezione dei dati è possibile scrivere a <strong>privacy@bugbusters-recruit.it</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Tipologie di dati raccolti</h2>
      <p className="mb-4">
        I dati raccolti includono:
        <ul className="list-disc list-inside mt-2">
          <li>Informazioni anagrafiche (nome, cognome, data di nascita)</li>
          <li>Dati di contatto (email, numero di telefono)</li>
          <li>Dati professionali (CV, esperienze lavorative, competenze)</li>
          <li>Dati di accesso alla piattaforma (email e password)</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Finalità del trattamento</h2>
      <p className="mb-4">
        I dati personali degli utenti sono trattati per:
        <ul className="list-disc list-inside mt-2">
          <li>Gestione della registrazione e autenticazione degli utenti</li>
          <li>Creazione e aggiornamento del profilo candidato o azienda</li>
          <li>Gestione delle candidature e invio di comunicazioni relative alle opportunità lavorative</li>
          <li>Analisi statistiche e miglioramento della qualità dei servizi offerti</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Base giuridica del trattamento</h2>
      <p className="mb-4">
        Il trattamento è basato sul consenso dell’utente, sull’esecuzione di obblighi contrattuali e sull’interesse legittimo del titolare a garantire il corretto funzionamento del servizio.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Conservazione dei dati</h2>
      <p className="mb-4">
        I dati personali saranno conservati per il tempo necessario a soddisfare le finalità per cui sono stati raccolti, nel rispetto dei termini previsti dalla normativa vigente.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Diritti dell’utente</h2>
      <p className="mb-4">
        L’utente ha il diritto di:
        <ul className="list-disc list-inside mt-2">
          <li>Accedere ai propri dati personali</li>
          <li>Chiederne la rettifica o la cancellazione</li>
          <li>Limitare o opporsi al trattamento</li>
          <li>Richiedere la portabilità dei dati</li>
        </ul>
        Tali diritti possono essere esercitati scrivendo a <strong>privacy@bugbustersrecruit.it</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Sicurezza dei dati</h2>
      <p className="mb-4">
        BugBusters Recruit adotta misure tecniche e organizzative adeguate a proteggere i dati personali da accessi non autorizzati, perdita, divulgazione o modifica.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Modifiche all'informativa</h2>
      <p className="mb-4">
        La presente informativa può essere soggetta a modifiche. Eventuali aggiornamenti saranno comunicati tramite la piattaforma o all'indirizzo email fornito dall’utente.
      </p>
    </div>
  );
};

export default Privacy;
