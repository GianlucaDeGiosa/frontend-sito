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
      const ruoloCandidatoId = 4;
      // 1. Registrazione utente
      const registerRes = await fetch("https://lovable-horses-1f1c111d86.strapiapp.com/api/auth/local/register", {
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
      const jwt = "a0f596a0d1ea453caebe947e3bd0ae8a098da7713c1d14a335ec7ddcfd8a732d48d75bbd236f12ecd82ecf813b9765e26a1b60d5d7a6413215310b917e2bcf2b2fcb726b6f0ffc05f53be2168fdcaa846f68e3ab31ac72bf9789ed79143e584a1c9d9687f28793721b67426846d679b0bba62b534ad48e7027376c70ea008154";

      localStorage.setItem("jwt", registerData.jwt);
      localStorage.setItem("user", JSON.stringify(registerData.user));

      // Aggiorna il ruolo dell’utente
      const roleUpdateRes = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}`, {
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
      const candidatoRes = await fetch("https://lovable-horses-1f1c111d86.strapiapp.com/api/candidatoes", {
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