import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/layout/Footer";
import About from "./pages/PagineFooter/about";
import Privacy from "./pages/PagineFooter/privacy";
import Terms from "./pages/PagineFooter/terms";
import Contatti from "./pages/PagineFooter/contatti";
import DashboardCandidato from "./pages/Candidato/dashboard-candidato";
import DashboardAzienda from "./pages/Azienda/dashboard-azienda";
import Profilo from "./pages/Candidato/profilo";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Routes>
        <Route path="/dashboard-candidato" element={<DashboardCandidato />} />
        <Route path="/dashboard-azienda" element={<DashboardAzienda />} />
        <Route path="/profilo-candidato" element={<Profilo />} />
      </Routes>

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contatti" element={<Contatti />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  padding: "1rem",
  backgroundColor: "#eaeaea"
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#007bff",
  fontWeight: "bold"
};

export default App;
