import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>BugBusters Recruit</h1>
      <nav>
        <Link to="/" className="no-underline">Home</Link>
        <Link to="/register" className="no-underline">Registrati</Link>
        <Link to="/login" className="no-underline">Login</Link>
      </nav>
    </div>
  );
};

export default Navbar;
