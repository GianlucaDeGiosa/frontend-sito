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
      const response = await fetch("http://localhost:1338/api/auth/local", {
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

      const jwt = "5cc5e00149f996aaab9e4a1fe0e4c2539e1010ece90b4e7669133d6411b20ee0a6ab8e7946f09bec12ba8b47d8bc93d132c50ec4be5e5b52c2922310db197714566c121660af7df48a191b60002e469ec166cd85fd65780346ebb1117f3ae0cff89a7d20da6d9abd60de041a100b1aa921ac73a05da0c3a33e0b07294552d3a1";
      // Fai una seconda richiesta per recuperare l'utente completo, incluso il ruolo
      const userRes = await fetch(`http://localhost:1338/api/users/${data.user.id}?populate=role`, {
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