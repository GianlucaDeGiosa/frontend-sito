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
      const ruoloAziendaId = /*3*/ 4;

      // 1. Registrazione utente
      // const registerRes = await fetch("https://lovable-horses-1f1c111d86.strapiapp.com/api/auth/local/register", {
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
        alert("Errore nella registrazione utente");
        return;
      }

      console.log("Azienda registrata con successo:", registerData);

      const userId = registerData.user.id;

      // const jwt = "dfc844b9c03479825c87ef987efcaa549f4a21f6308e35534700be4d86c6d12b374548cfa165ffe8757d25d9c67b137f7fb926f4f7da80eadc5fa220d18bcfaa8c4d2880bd6d61552aa49cafcdb572f129ee2b7b0b171eff206a09e6f714978c46d5aa055d995aba99585d160f548acb79d88f8069eb9249f2a43d5a3b6258ef";
      const jwt = "5cc5e00149f996aaab9e4a1fe0e4c2539e1010ece90b4e7669133d6411b20ee0a6ab8e7946f09bec12ba8b47d8bc93d132c50ec4be5e5b52c2922310db197714566c121660af7df48a191b60002e469ec166cd85fd65780346ebb1117f3ae0cff89a7d20da6d9abd60de041a100b1aa921ac73a05da0c3a33e0b07294552d3a1";

      localStorage.setItem("jwt", registerData.jwt);
      localStorage.setItem("userId", registerData.user.id);

      // Aggiorna il ruolo dell’utente
      // const roleUpdateRes = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}`, {
      const roleUpdateRes = await fetch(`http://localhost:1338/api/users/${userId}`, {
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
      // const aziendaRes = await fetch("https://lovable-horses-1f1c111d86.strapiapp.com/api/aziendas", {
      const aziendaRes = await fetch("http://localhost:1338/api/aziendas", {
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
