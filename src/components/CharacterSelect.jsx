import { useState } from "react";
import "./CharacterSelect.css";

import viejo from "../assets/rolando_avatar.png";
import marc from "../assets/santiago_avatar.png";
import motivador from "../assets/amaya_avatar.png";
import reclutadora from "../assets/daniela_avatar.png";

export default function CharacterSelect({ onSelectCharacter, onBack }) {
  const [selected, setSelected] = useState(null);

  const characters = [
    { id: 1, name: "Viejo Sabroso", image: viejo },
    { id: 2, name: "Marc Anthony", image: marc },
    { id: 3, name: "El Motivador", image: motivador },
    { id: 4, name: "La Reclutadora", image: reclutadora },
  ];

  return (
    <div className="character-container">
      <header className="header">
        <h1 className="game-title">CIPA DJSR</h1>
      </header>

      <div className="character-content">
        <h2>Elige tu personaje</h2>

        <div className="character-grid">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`character-card ${
                selected === char.id ? "selected" : ""
              }`}
              onClick={() => setSelected(char.id)}
            >
              <img src={char.image} alt={char.name} className="character-img" />
              <p className="character-name">{char.name}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px" }}>
          <button className="start-button" onClick={onBack}>
            Volver
          </button>

          {selected && (
            <button
              className="start-button"
              style={{ marginLeft: "20px" }}
              onClick={() => {
                const chosen = characters.find((c) => c.id === selected);
                onSelectCharacter(chosen);
              }}
            >
              Continuar
            </button>
          )}
        </div>
      </div>

      <footer className="footer">
        Creación de <b>CIPA DJSR</b> — Profe, pónganos 5 😎
      </footer>
    </div>
  );
}
