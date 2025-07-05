import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CandidateForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Nome: "",
    Cognome: "",
    Email: "",
    Password: "",
    DataNascita: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const ruoloCandidatoId = 3;

      // 1. Registrazione utente
      const registerRes = await fetch("http://localhost:1338/api/auth/local/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.Email,
          email: form.Email,
          password: form.Password
        })
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        console.error("Errore nella registrazione utente:", registerData);
        alert("Errore nella registrazione utente.");
        return;
      }

      console.log("Candidato registrato con successo:", registerData);

      const userId = registerData.user.id;

      const jwt = "5cc5e00149f996aaab9e4a1fe0e4c2539e1010ece90b4e7669133d6411b20ee0a6ab8e7946f09bec12ba8b47d8bc93d132c50ec4be5e5b52c2922310db197714566c121660af7df48a191b60002e469ec166cd85fd65780346ebb1117f3ae0cff89a7d20da6d9abd60de041a100b1aa921ac73a05da0c3a33e0b07294552d3a1";
      localStorage.setItem("jwt", registerData.jwt);
      localStorage.setItem("userId", registerData.user.id);

      // Aggiorna il ruolo dell’utente
      const roleUpdateRes = await fetch(`http://localhost:1338/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          role: ruoloCandidatoId
        })
      });

      if (!roleUpdateRes.ok) {
        const error = await roleUpdateRes.json();
        console.error("Errore aggiornamento ruolo:", error);
        alert("Errore nell'aggiornamento del ruolo.");
        return;
      }

      console.log("Ruolo aggiornato con successo");

      const token = jwt;

      // 2. Creazione candidato
      const candidatoRes = await fetch("http://localhost:1338/api/candidatoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            Nome: form.Nome,
            Cognome: form.Cognome,
            DataNascita: form.DataNascita,
            users_permissions_user: userId
          }
        })
      });

      const candidatoData = await candidatoRes.json();

      if (!candidatoRes.ok) {
        console.error("Errore nella creazione candidato:", candidatoData);
        return;
      }

      console.log("Candidato registrato con successo:", candidatoData);
      alert("Registrazione Candidato completata con successo!");

    } catch (error) {
      console.error("Errore generale nella registrazione:", error);
      alert("Errore nella registrazione. Password minima 6 caratteri");
    }

    navigate("/dashboard-candidato");
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <label htmlFor="Nome">Nome</label>
      <input name="Nome" placeholder="Mario" onChange={handleChange} required />

      <label htmlFor="Cognome">Cognome</label>
      <input name="Cognome" placeholder="Rossi" onChange={handleChange} required />

      <label htmlFor="Email">Email</label>
      <input type="email" name="Email" placeholder="mariorossi@gmail.com" onChange={handleChange} required />

      <label htmlFor="Password">Password</label>
      <input type="password" name="Password" placeholder="Password1234" onChange={handleChange} required />

      <label htmlFor="DataNascita">Data di Nascita</label>
      <input type="date" name="DataNascita" onChange={handleChange} required />

      <button type="submit">Registrati come Candidato</button>
    </form>
  );
};

export default CandidateForm;
