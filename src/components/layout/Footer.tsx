// src/components/layout/Footer.tsx

import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about">Chi siamo</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Termini e Condizioni</Link>
        <Link to="/contatti">Contatti</Link>
      </div>
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} BugBusters Recruit – Tutti i diritti riservati.
      </p>
    </footer>
  );
};

export default Footer;
