import React from "react";
import "./HomeScreen.css";
import portada from "../assets/sql-quest-banner.png";

export default function HomeScreen({ onStartAdventure }) {
  return (
    <div className="home-container">
      {/* ENCABEZADO */}
      <header className="header">
        <h1 className="game-title">CIPA DJSR</h1>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <p className="welcome-text">
          Bienvenido a <strong>Oracle Quest</strong> — Explora los secretos del
          almacenamiento de bases de datos a través de misiones interactivas.
        </p>

        <img src={portada} alt="Portada SQL Quest" className="banner" />

        <button className="start-button" onClick={onStartAdventure}>
          Comenzar la aventura
        </button>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="footer">
        Creación de <strong>CIPA DJSR</strong> — Profe, pónganos 5 😎
      </footer>
    </div>
  );
}
