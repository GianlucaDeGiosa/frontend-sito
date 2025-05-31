import React from "react";
import './InfoPages.css';

const About = () => {
  return (
    <div className="info-container">
      <h1 className="text-3xl font-bold mb-4">Chi siamo</h1>

      <p className="mb-4">
        BugBusters Recruit è una piattaforma pensata per connettere talenti e aziende
        in modo intelligente. Il nostro obiettivo è semplificare il processo di
        selezione e aiutare le persone a trovare il lavoro ideale.
      </p>

      <p className="mb-4">
        Il sistema descrive le funzionalità previste per il sistema di Recruiting Digitale,
        con l’obiettivo di rispondere in modo efficace e innovativo alle esigenze sia dei candidati
        in cerca di nuove opportunità professionali, sia delle aziende alla ricerca di profili compatibili
        con le proprie posizioni aperte. È pensato per migliorare l'incontro tra domanda e offerta di lavoro,
        ottimizzando il processo di selezione, feedback e matching avanzato.
      </p>

      <p className="mb-4">
        Le funzionalità sono suddivise secondo due macro-categorie di utenti:
        <ul className="list-disc list-inside mt-2">
          <li>
            <strong>Candidati:</strong> il sistema mette a disposizione strumenti per descrivere in modo dettagliato il proprio profilo professionale, tecnico e personale, nonché interagire direttamente con le aziende attraverso feedback e prenotazioni di colloqui.
          </li>
          <li>
            <strong>Aziende:</strong> la piattaforma consente di definire con precisione i requisiti delle posizioni aperte, visualizzare candidati compatibili, fornire feedback sulle candidature, comunicare la propria cultura aziendale e condividere materiali formativi.
          </li>
        </ul>
      </p>

      <p className="mb-4">
        Nel dettaglio, i requisiti funzionali descritti sono orientati a:
        <ul className="list-disc list-inside mt-2">
          <li>Migliorare la visibilità e valorizzazione del profilo del candidato</li>
          <li>Facilitare la comunicazione bidirezionale tra candidati e aziende</li>
          <li>Fornire feedback continuo da parte di candidati e aziende</li>
          <li>Promuovere la compatibilità culturale tra azienda e lavoratore</li>
        </ul>
      </p>

      <p className="mb-4">
        Il progetto nasce da un team di studenti con la missione di digitalizzare il
        recruiting in Italia con strumenti semplici, trasparenti e veloci.
      </p>

      <p>
        Il sistema nasce in risposta ai cambiamenti nel mercato del lavoro, dove candidati e aziende richiedono
        strumenti più efficaci per l’incontro tra domanda e offerta. Le aziende cercano profili sempre più mirati,
        valutando non solo competenze tecniche ma anche attitudini, preferenze e compatibilità culturale. I candidati,
        a loro volta, vogliono opportunità che riflettano i propri obiettivi, valori e modalità di lavoro ideali.
      </p>

      <p>
        Il Recruiting System proposto mira a semplificare e rendere più preciso il processo di selezione, migliorando
        la qualità dei match e riducendo tempi e costi per entrambi gli attori, anche grazie a funzionalità intelligenti
        come filtri, feedback e formazione mirata da parte dell’azienda.
      </p>
    </div>
  );
};

export default About;
