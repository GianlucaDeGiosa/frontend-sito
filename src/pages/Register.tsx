import React, { useState } from "react";
import CandidateForm from "../components/forms/CandidateForm";
import CompanyForm from "../components/forms/CompanyForm";
import "./Register.css";

const Register = () => {
  const [role, setRole] = useState<"candidato" | "azienda">("candidato");

  return (
    <div className="register-container">
      <div className="register-header">
        <h1>Registrazione</h1>
      </div>
      <div className="register-buttons">
        <button
          className={role === "candidato" ? "active" : ""} onClick={() => setRole("candidato")}>Candidato
        </button>
        <button
          className={role === "azienda" ? "active" : ""} onClick={() => setRole("azienda")}>Azienda
        </button>
      </div>

      {role === "candidato" && <CandidateForm />}
      {role === "azienda" && <CompanyForm />}
    </div>
  );
};

export default Register;