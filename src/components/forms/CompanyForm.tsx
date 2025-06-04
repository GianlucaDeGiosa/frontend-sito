import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    NomeAzienda: "",
    Settore: "",
    Email: "",
    Password: "",
    PartitaIva: "",
    SedeLegale: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const ruoloAziendaId = 3;
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
        alert("Errore nella registrazione utente");
        return;
      }

      console.log("Azienda registrata con successo:", registerData);

      const userId = registerData.user.id;
      const jwt = "b5632dd6d92dc4e479b3ac08cc274838e51f3a615ef860826377250ca6eed93472c36c340f0a141655ac185f2fe1ba79ae5191c24202e333cd5ca1c22e5fb89bd0d401b31d7a666281b2174c0b1253388236e58d50e1b6328042c5d8a87fe55d129448d5480bff690fbd0b2123745dc4e95caef908cb5311797e70634a61b3ba";

      localStorage.setItem("jwt", registerData.jwt);
      localStorage.setItem("userId", registerData.user.id);
      
      // Aggiorna il ruolo dell’utente
      const roleUpdateRes = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          role: ruoloAziendaId
        })
      });

      if (!roleUpdateRes.ok) {
        const error = await roleUpdateRes.json();
        console.error("Errore aggiornamento ruolo:", error);
        alert("Errore aggiornamento ruolo");
        return;
      }

      const roleUpdateData = await roleUpdateRes.json();
      console.log("Risposta aggiornamento ruolo:", roleUpdateData);

      console.log("Ruolo aggiornato con successo");

      // 2. Creazione azienda
      const aziendaRes = await fetch("https://lovable-horses-1f1c111d86.strapiapp.com/api/aziendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          data: {
            NomeAzienda: form.NomeAzienda,
            Settore: form.Settore,
            PartitaIva: form.PartitaIva,
            SedeLegale: form.SedeLegale,
            users_permissions_user: userId
          }
        })
      });

      const aziendaData = await aziendaRes.json();

      if (!aziendaRes.ok) {
        console.error("Errore nella creazione azienda:", aziendaData);
        return;
      }

      console.log("Azienda creata con successo:", aziendaData);
      alert("Registrazione Azienda completata con successo!");

    } catch (error) {
      console.error("Errore generale nella registrazione:", error);
      alert("Errore nella registrazione. Password minima 6 caratteri");
    }
    navigate("/dashboard-azienda");
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <label htmlFor="Nome">Nome Azienda</label>
      <input name="NomeAzienda" placeholder="BugBusters" onChange={handleChange} required />

      <label htmlFor="Settore">Settore</label>
      <input name="Settore" placeholder="Informatica" onChange={handleChange} required />

      <label htmlFor="Email">Email</label>
      <input type="email" name="Email" placeholder="bugbusters@gmail.com" onChange={handleChange} required />

      <label htmlFor="Password">Password</label>
      <input type="password" name="Password" placeholder="Password1234" onChange={handleChange} required />

      <label htmlFor="PartitaIva">Partita Iva</label>
      <input
        type="number"
        min="10000000000"
        max="99999999999"
        placeholder="01234567890"
        name="PartitaIva"
        onChange={handleChange}
        required
      />

      <label htmlFor="SedeLegale">Sede Legale</label>
      <input name="SedeLegale" placeholder="Bari" onChange={handleChange} required />

      <button type="submit">Registrati come Azienda</button>
    </form>
  );
};

export default CompanyForm;
