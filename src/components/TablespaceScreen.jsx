import React, { useState, useEffect, useRef } from "react";
import "./ControlfileScreen.css";
import TablespaceQuiz from "./TablespaceQuiz";

export default function TablespaceScreen({ character, onBack }) {
  const [output, setOutput] = useState([
    `💬 ${character?.name ?? "Guía"}: Bienvenida/o. En esta misión aprenderás sobre los TABLESPACES y su relación con los DATAFILES.`,
    "💬 Lee la guía de la izquierda y luego ejecuta los comandos ALTER TABLESPACE para practicar."
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [explanations, setExplanations] = useState([]);
  const [expIndex, setExpIndex] = useState(0);
  const [showExplanations, setShowExplanations] = useState(true); // 👈 ya se muestra desde el inicio
  const [nextCommandTip, setNextCommandTip] = useState(
    "👉 Cuando termines de leer, ejecuta: ALTER TABLESPACE TBS2 READ ONLY;"
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const outRef = useRef();

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [output]);

  const append = (txt) => setOutput((o) => [...o, txt]);
  const normalize = (s) => s.trim().replace(/\s+/g, " ").toUpperCase();

  // 🧠 Explicación inicial automática
  useEffect(() => {
    setExplanations([
      {
        title: "¿Qué es un Datafile?",
        text: `Un DATAFILE es un archivo físico del sistema operativo que almacena los datos reales de una base de datos Oracle.\n\nPor ejemplo, los registros de clientes, inventario o ventas se guardan dentro de estos archivos. Cada DATAFILE pertenece a un TABLESPACE.`
      },
      {
        title: "¿Qué es un Tablespace?",
        text: `Un TABLESPACE es una unidad lógica que agrupa uno o más DATAFILES.\n\nSirve para organizar los datos dentro de la base de datos. Por ejemplo, un tablespace llamado USERS puede tener varios datafiles donde se guardan los datos de los usuarios del sistema.`
      },
      {
        title: "Relación entre ambos",
        text: `Podemos decir que los TABLESPACES son las “carpetas lógicas” de Oracle, mientras que los DATAFILES son los “archivos reales” que guardan la información.\n\nCuando gestionamos un TABLESPACE (por ejemplo, ponerlo en READ ONLY o OFFLINE), estamos afectando a los DATAFILES que lo componen.`
      },
      {
        title: "A partir de ahora...",
        text: `Ahora que sabes qué son los DATAFILES y TABLESPACES, practicarás los comandos para administrarlos con ALTER TABLESPACE.\n\nEmpieza escribiendo: ALTER TABLESPACE TBS2 READ ONLY;`
      }
    ]);
  }, []);

  // 📘 Comandos válidos
  function showHelp() {
    append("Comandos válidos (simulados):");
    append(" - ALTER TABLESPACE TBS2 READ ONLY;");
    append(" - ALTER TABLESPACE TBS2 READ WRITE;");
    append(" - ALTER TABLESPACE TBS2 OFFLINE NORMAL;");
    append(" - ALTER TABLESPACE TBS2 OFFLINE TEMPORARY;");
    append(" - ALTER TABLESPACE TBS2 OFFLINE IMMEDIATE;");
    append(" - ALTER TABLESPACE TBS2 ONLINE;");
  }

  // 📗 Explicaciones de cada modo
  function buildExplanationsReadOnly() {
    return [
      {
        title: "READ ONLY",
        text: `El modo READ ONLY hace que el tablespace sea de solo lectura.\nNo se pueden modificar ni insertar datos, pero sí consultarlos.\n\nIdeal para respaldos o datos históricos que no deben cambiar.`
      }
    ];
  }

  function buildExplanationsReadWrite() {
    return [
      {
        title: "READ WRITE",
        text: `Devuelve el tablespace a su estado normal, permitiendo operaciones DML (INSERT, UPDATE, DELETE).\n\nSe usa tras un READ ONLY cuando se requiere volver a modificar datos.`
      }
    ];
  }

  function buildExplanationsOffline() {
    return [
      {
        title: "OFFLINE NORMAL",
        text: `Desconecta el tablespace solo si no hay usuarios activos. Espera que terminen sus transacciones antes de bajarlo.\n\nEs el modo más seguro para mantenimiento.`
      },
      {
        title: "OFFLINE TEMPORARY",
        text: `Desactiva el tablespace incluso si hay usuarios, pero deja que sus transacciones terminen antes de cerrar los archivos.\n\nMenos estricto que NORMAL.`
      },
      {
        title: "OFFLINE IMMEDIATE",
        text: `Desactiva el tablespace de inmediato, sin esperar a usuarios ni transacciones.\n\nSolo se usa en emergencias o cuando hay errores graves.`
      }
    ];
  }

  function buildExplanationsOnline() {
    return [
      {
        title: "ONLINE",
        text: `Reactiva un tablespace que estaba OFFLINE.\n\nUna vez online, todos los usuarios pueden acceder nuevamente a sus datos.`
      }
    ];
  }

  // 🧮 Procesamiento de comandos
  function runCommand(raw) {
    if (!raw.trim()) {
      append("❌ Escribe un comando o HELP para ver las opciones.");
      return;
    }

    if (!raw.trim().endsWith(";") && normalize(raw) !== "HELP") {
      append("❌ Escribe el comando completo, terminando con punto y coma (;)");
      return;
    }

    const cmd = normalize(raw.replace(/;$/, ""));
    append("> " + raw);

    if (cmd === "HELP") {
      showHelp();
      return;
    }

    // READ ONLY
    if (cmd.includes("READ ONLY")) {
      append("ALTER TABLESPACE ejecutado: TBS2 ahora es de solo lectura.");
      setExplanations(buildExplanationsReadOnly());
      setShowExplanations(true);
      setExpIndex(0);
      setStep(1);
      setNextCommandTip("👉 Cambia el estado a escritura con: ALTER TABLESPACE TBS2 READ WRITE;");
      return;
    }

    // READ WRITE
    if (cmd.includes("READ WRITE")) {
      append("ALTER TABLESPACE ejecutado: TBS2 permite lectura y escritura.");
      setExplanations(buildExplanationsReadWrite());
      setShowExplanations(true);
      setExpIndex(0);
      setStep(2);
      setNextCommandTip("👉 Practiquemos los modos OFFLINE. Ejecuta: ALTER TABLESPACE TBS2 OFFLINE NORMAL;");
      return;
    }

    // OFFLINE NORMAL
    if (cmd.includes("OFFLINE NORMAL")) {
      append("ALTER TABLESPACE ejecutado: TBS2 está OFFLINE (NORMAL).");
      setExplanations([buildExplanationsOffline()[0]]);
      setShowExplanations(true);
      setExpIndex(0);
      setStep(3);
      setNextCommandTip("👉 Ahora: ALTER TABLESPACE TBS2 OFFLINE TEMPORARY;");
      return;
    }

    // OFFLINE TEMPORARY
    if (cmd.includes("OFFLINE TEMPORARY")) {
      append("ALTER TABLESPACE ejecutado: TBS2 está OFFLINE (TEMPORARY).");
      setExplanations([buildExplanationsOffline()[1]]);
      setShowExplanations(true);
      setExpIndex(0);
      setStep(4);
      setNextCommandTip("👉 Prueba el modo de emergencia: ALTER TABLESPACE TBS2 OFFLINE IMMEDIATE;");
      return;
    }

    // OFFLINE IMMEDIATE
    if (cmd.includes("OFFLINE IMMEDIATE")) {
      append("ALTER TABLESPACE ejecutado: TBS2 está OFFLINE (IMMEDIATE).");
      setExplanations([buildExplanationsOffline()[2]]);
      setShowExplanations(true);
      setExpIndex(0);
      setStep(5);
      setNextCommandTip("👉 Finalmente, vuelve a activarlo con: ALTER TABLESPACE TBS2 ONLINE;");
      return;
    }

    // ONLINE
    if (cmd.includes("ONLINE")) {
      append("ALTER TABLESPACE ejecutado: TBS2 ha vuelto ONLINE.");
      setExplanations(buildExplanationsOnline());
      setShowExplanations(true);
      setExpIndex(0);
      setStep(6);
      setNextCommandTip("🎯 ¡Excelente! Has completado todos los modos del tablespace. Pulsa abajo para hacer la evaluación final.");
      return;
    }

    append("Comando no reconocido. Escribe HELP para ver opciones.");
  }

  // 🔁 Navegación entre explicaciones
  const nextExp = () => {
    if (expIndex < explanations.length - 1) {
      setExpIndex((i) => i + 1);
    } else if (nextCommandTip) {
      append("💬 Explicación finalizada. " + nextCommandTip);
    }
  };
  const closeExplanations = () => setShowExplanations(false);

  // 🧩 Quiz final
  if (showQuiz) {
    return <TablespaceQuiz character={character} onBackToFiles={onBack} />;
  }

  return (
    <div className="controlfile-wrap">
      <header className="header-small">
        <h1>Oracle Quest — Tablespaces</h1>
        <div>
          <button className="back" onClick={onBack}>Volver</button>
        </div>
      </header>

      <div className="controlfile-grid">
        {/* PANEL IZQUIERDO */}
        <aside className="left-panel">
          <div className="avatar-box">
            {character?.image ? (
              <img src={character.image} alt={character.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">🧑‍💻</div>
            )}
          </div>

          <div className="guide-box">
            <h2>{character?.name ?? "Guía"}</h2>
            <div className="guide-text">
              <p><b>Objetivos:</b></p>
              <ul>
                <li>Comprender la relación entre DATAFILES y TABLESPACES</li>
                <li>Aprender los modos READ ONLY y READ WRITE</li>
                <li>Conocer los tipos de OFFLINE</li>
                <li>Reactivar tablespaces con ONLINE</li>
              </ul>
            </div>

            <div className="explain-shell">
              <div className="explain-detail">
                <div className="explain-head">
                  <strong>{explanations[expIndex]?.title}</strong>
                  <span className="exp-count">{expIndex + 1}/{explanations.length}</span>
                </div>
                <div className="explain-body">
                  <pre className="explain-text">{explanations[expIndex]?.text}</pre>
                </div>
                <div className="explain-controls">
                  {expIndex < explanations.length - 1 && (
                    <button onClick={nextExp}>Siguiente →</button>
                  )}
                  <button onClick={closeExplanations} className="close-exp">Cerrar</button>
                </div>
              </div>
            </div>

            {nextCommandTip && (
              <div className="next-tip">
                <p><b>Siguiente paso:</b></p>
                <p>{nextCommandTip}</p>
              </div>
            )}

            {step >= 6 && (
              <div className="evaluation-box">
                <button className="eval-btn" onClick={() => setShowQuiz(true)}>
                  Realizar Evaluación Final
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* PANEL DERECHO */}
        <main className="right-panel">
          <div className="terminal">
            <div className="terminal-output" ref={outRef}>
              {output.map((line, i) => (
                <div key={i} className="out-line">{line}</div>
              ))}
            </div>
            <div className="terminal-controls">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un comando (ej. ALTER TABLESPACE TBS2 READ ONLY;)"
                onKeyDown={(e) => e.key === "Enter" && runCommand(input)}
              />
              <div className="term-buttons">
                <button onClick={() => runCommand(input)}>Ejecutar</button>
                <button onClick={() => { setOutput([]); append("Consola limpia."); }}>Limpiar</button>
              </div>
            </div>
            <div className="terminal-footer">
              <div>Progreso: {Math.floor(step)}/6</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
