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

      const jwt = "a0f596a0d1ea453caebe947e3bd0ae8a098da7713c1d14a335ec7ddcfd8a732d48d75bbd236f12ecd82ecf813b9765e26a1b60d5d7a6413215310b917e2bcf2b2fcb726b6f0ffc05f53be2168fdcaa846f68e3ab31ac72bf9789ed79143e584a1c9d9687f28793721b67426846d679b0bba62b534ad48e7027376c70ea008154";

      // Fai una seconda richiesta per recuperare l'utente completo, incluso il ruolo
      const userRes = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${data.user.id}?populate=role`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const fullUser = await userRes.json();
      const userRole = fullUser.role?.name?.toLowerCase().trim() || "generico";
      console.log("Ruolo completo:", userRole);

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
