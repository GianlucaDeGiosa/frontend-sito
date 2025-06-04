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

      const jwt = "b5632dd6d92dc4e479b3ac08cc274838e51f3a615ef860826377250ca6eed93472c36c340f0a141655ac185f2fe1ba79ae5191c24202e333cd5ca1c22e5fb89bd0d401b31d7a666281b2174c0b1253388236e58d50e1b6328042c5d8a87fe55d129448d5480bff690fbd0b2123745dc4e95caef908cb5311797e70634a61b3ba";

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