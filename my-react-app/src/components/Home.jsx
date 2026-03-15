import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">ESOP Chain</h2>

        <div className="nav-buttons">
          <button className="nav-login" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="nav-signup" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Blockchain-Based ESOP Management System
        </h1>

        <p className="hero-text">
          Securely manage Employee Stock Ownership Plans using blockchain 
          technology. Transparent, tamper-proof, and efficient equity 
          management for modern organizations.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature-card">
          <h3>Secure</h3>
          <p>Blockchain ensures tamper-proof ESOP records.</p>
        </div>

        <div className="feature-card">
          <h3>Transparent</h3>
          <p>Employees can easily track their equity shares.</p>
        </div>

        <div className="feature-card">
          <h3>Efficient</h3>
          <p>Automated management of stock options and grants.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © 2026 ESOP Chain | Blockchain Based Equity Management
      </footer>

    </div>
  );
}

export default Home;