// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://lovable-horses-1f1c111d86.strapiapp.com/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error?.message || "Errore di autenticazione");
        alert("Errore di autenticazione");
        return;
      }

      console.log("Login riuscito:", data);

      const jwt = "dfc844b9c03479825c87ef987efcaa549f4a21f6308e35534700be4d86c6d12b374548cfa165ffe8757d25d9c67b137f7fb926f4f7da80eadc5fa220d18bcfaa8c4d2880bd6d61552aa49cafcdb572f129ee2b7b0b171eff206a09e6f714978c46d5aa055d995aba99585d160f548acb79d88f8069eb9249f2a43d5a3b6258ef";

      // Fai una seconda richiesta per recuperare l'utente completo, incluso il ruolo
      const userRes = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${data.user.id}?populate=role`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });


      const fullUser = await userRes.json();
      const userRole = fullUser.role?.name?.toLowerCase().trim() || "generico";
      console.log("Ruolo completo:", userRole);

      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("userId", data.user.id);

      // Redireziona in base al ruolo
      switch (userRole) {
        case "candidato":
          navigate("/dashboard-candidato");
          break;
        case "azienda":
          navigate("/dashboard-azienda");
          break;
        default:
          navigate("/");
          break;
        }
    } catch (err) {
    console.error("Errore connessione:", err);
      setError("Errore di connessione al server");
      alert("Errore di connessione al server");
    }
    
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Login</h1>
        <p>Accedi con le tue credenziali</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required/>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;