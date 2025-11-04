import React from "react";
import "./CharacterPanel.css";

/**
 * Shows the chosen character (static) and the step explanations (short + expand)
 */
export default function CharacterPanel({ character, step, stepIndex, totalSteps, onNext, onHint }) {
  return (
    <div className="character-panel">
      <div className="avatar-box">
        {/* si tienes imagen pasa character.image, si no muestra inicial */}
        {character?.image ? (
          <img src={character.image} alt={character.name} className="avatar-img" />
        ) : (
          <div className="avatar-placeholder">{(character?.name || "Jugador")[0]}</div>
        )}
        <div className="avatar-name">{character?.name || "Jugador"}</div>
      </div>

      <div className="lesson-box">
        <h3 className="lesson-title">{step.title}</h3>
        <p className="lesson-short">{step.explanationShort}</p>

        <details className="lesson-long">
          <summary>Ver explicación detallada</summary>
          <p>{step.explanationLong}</p>
        </details>

        <div className="lesson-actions">
          {step.expected === null ? (
            <button onClick={onNext} className="btn-primary">Siguiente</button>
          ) : (
            <div>
              <button onClick={onHint} className="btn-secondary">💡 Pista (-5 pts)</button>
              <div className="hint-note">Pista: {step.hint || "Usa un comando SQL relacionado al tema."}</div>
            </div>
          )}
        </div>

        <div className="progress">
          Paso {stepIndex + 1} / {totalSteps}
        </div>
      </div>
    </div>
  );
}
