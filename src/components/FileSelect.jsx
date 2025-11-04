import React from "react";
import "./FileSelect.css";

export default function FileSelect({ character, onSelectFile, onBack }) {
  const files = [
    {
      id: 1,
      name: "Controlfile",
      description:
        "Contiene la estructura esencial de la base de datos. Sin él, Oracle no puede iniciar correctamente.",
    },
    {
      id: 2,
      name: "Datafile",
      description:
        "Guarda los datos reales de las tablas, índices y objetos del usuario. Es el corazón del almacenamiento.",
    },
  ];

  return (
    <div className="file-select-container">
      <header className="header">
        <h1 className="game-title">CIPA DJSR</h1>
      </header>

      <main className="file-main">
        <h2 className="file-title">
          {character} ha despertado...  
          <br />
          Elige tu destino 
        </h2>

        <div className="file-grid">
          {files.map((file) => (
            <div
              key={file.id}
              className="file-card"
              onClick={() => onSelectFile(file)}
            >
              <h3 className="file-name">{file.name}</h3>
              <p className="file-description">{file.description}</p>
            </div>
          ))}
        </div>

        <button className="back-button" onClick={onBack}>
          Volver
        </button>
      </main>

      <footer className="footer">
        Creación de <b>CIPA DJSR</b> — Profe, pónganos 5 😎
      </footer>
    </div>
  );
}
