import React, { useState, useEffect, useRef } from "react";
import "./ControlfileScreen.css";
import ControlfileQuiz from "./ControlfileQuiz";

const SIM_DB = {
  db_name: "ORCL_QUEST",
  controlfile: {
    name: "control01.ctl",
    created: "2023-05-12 10:23:00",
    status: "NORMAL",
    checkpoint: "SCN 124578",
    current_redo: 7,
    datafiles: [
      { file_name: "users01.dbf", size_mb: 512, status: "ONLINE" },
      { file_name: "orders01.dbf", size_mb: 1024, status: "ONLINE" },
      { file_name: "products01.dbf", size_mb: 256, status: "OFFLINE - CORRUPT" }
    ],
    redo_logs: [
      { seq: 5, file: "redo05.log" },
      { seq: 6, file: "redo06.log" },
      { seq: 7, file: "redo07.log" }
    ]
  }
};

export default function ControlfileScreen({ character, onBack }) {
  const [output, setOutput] = useState([
    `💬 ${character?.name ?? "Guía"}: Bienvenida/o. Escribe HELP para ver comandos.`
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [explanations, setExplanations] = useState([]);
  const [expIndex, setExpIndex] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);
  const [nextCommandTip, setNextCommandTip] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const outRef = useRef();

  useEffect(() => {
    if (outRef.current) {
      outRef.current.scrollTop = outRef.current.scrollHeight;
    }
  }, [output]);

  const append = (txt) => setOutput((o) => [...o, txt]);
  const normalize = (s) => s.trim().replace(/\s+/g, " ").toUpperCase();

  function showHelp() {
    append("Comandos válidos (simulados):");
    append(" - SHOW CONTROLFILE;");
    append(" - SELECT * FROM DBA_DATA_FILES;");
    append(" - SELECT FILE_NAME FROM DBA_DATA_FILES WHERE STATUS LIKE '%CORRUPT%';");
    append(" - SELECT * FROM V$LOG;");
    append(" - MAS INFO");
  }

  function buildControlfileExplanations() {
    const cf = SIM_DB.controlfile;
    return [
      {
        title: "CONTROLFILE (archivo esencial)",
        text: `El controlfile es el archivo más importante de Oracle. Guarda la estructura de la base de datos, ubicaciones de datafiles y redo logs. Si se pierde, la base no puede montarse hasta restaurarlo.`
      },
      {
        title: "DB_NAME (nombre de la base de datos)",
        text: `Identifica de forma única la base de datos. Oracle lo usa para distinguir entre instancias distintas. Ejemplo: ${SIM_DB.db_name}`
      },
      {
        title: "CREATED (fecha de creación)",
        text: `Muestra cuándo se creó la base. Esta fecha ayuda a detectar si los archivos pertenecen a una base actual o a una restaurada. Ejemplo: ${cf.created}`
      },
      {
        title: "STATUS",
        text: `Indica si el controlfile está operativo. 'NORMAL' significa que está sincronizado con datafiles y redo logs. Si muestra error, puede implicar corrupción o pérdida de archivos.`
      },
      {
        title: "CHECKPOINT (SCN)",
        text: `El SCN es un número que representa hasta qué punto se han guardado los cambios. Oracle lo usa para saber qué tan actualizados están los datafiles y si necesita aplicar redo logs.`
      },
      {
        title: "CURRENT REDO SEQUENCE",
        text: `Muestra el redo log que se está usando actualmente para registrar cambios. Ejemplo: secuencia ${cf.current_redo}`
      },
      {
        title: "DATAFILES",
        text: `Son los archivos físicos donde se guardan los datos de las tablas. Cada uno puede estar ONLINE (activo), OFFLINE (no disponible) o CORRUPT (dañado). Ejemplo:\n${cf.datafiles.map(d => `• ${d.file_name} — ${d.status}`).join("\n")}`
      }
    ];
  }

  function buildRedoExplanations() {
    const logs = SIM_DB.controlfile.redo_logs;
    return [
      {
        title: "REDO LOGS (registros de rehacer)",
        text: `Los redo logs almacenan todas las operaciones antes de que se guarden en los datafiles. Si el sistema falla, Oracle los usa para recuperar transacciones pendientes. Ejemplo:\n${logs.map(l => `• ${l.file}`).join("\n")}`
      },
      {
        title: "SECUENCIA ACTUAL",
        text: `Cada redo log tiene un número. El más alto es el activo en este momento. Cuando se llena, Oracle pasa al siguiente archivo automáticamente.`
      }
    ];
  }

  function buildMountExplanations() {
    return [
      {
        title: "NOMOUNT — Inicio de instancia",
        text: `En este estado, Oracle arranca su instancia (procesos y memoria) pero no abre aún los archivos. Se usa para crear una base nueva o restaurar archivos de control dañados.`
      },
      {
        title: "MOUNT — Asociación con controlfiles",
        text: `Aquí Oracle ya abre los controlfiles, lo que le permite conocer los datafiles y redo logs existentes. Todavía no abre los datafiles, lo que es útil para tareas de mantenimiento o recuperación.`
      },
      {
        title: "OPEN — Base de datos disponible",
        text: `Oracle abre los datafiles y redo logs, haciendo que la base esté lista para que los usuarios trabajen. En este punto, todos los componentes están sincronizados.`
      }
    ];
  }

  function runCommand(raw) {
    if (!raw.trim().endsWith(";")) {
      append("❌ Escribe el comando completo, terminando con punto y coma (;)");
      return;
    }

    const cmd = normalize(raw.replace(/;$/, ""));
    append("> " + raw);

    if (cmd === "HELP") {
      showHelp();
      return;
    }

    // SHOW CONTROLFILE
    if (cmd.includes("SHOW CONTROLFILE")) {
      const cf = SIM_DB.controlfile;
      [
        `CONTROLFILE: ${cf.name}`,
        `DB_NAME: ${SIM_DB.db_name}`,
        `CREATED: ${cf.created}`,
        `STATUS: ${cf.status}`,
        `CHECKPOINT: ${cf.checkpoint}`,
        `CURRENT REDO SEQUENCE: ${cf.current_redo}`,
        `DATAFILES:`,
        ...cf.datafiles.map(d => ` - ${d.file_name} (${d.size_mb} MB) : ${d.status}`)
      ].forEach(l => append(l));

      append("✅ Observa la información del controlfile.");
      setExplanations(buildControlfileExplanations());
      setExpIndex(0);
      setShowExplanations(true);
      setStep(1);
      setNextCommandTip("👉 Cuando termines, ejecuta: SELECT * FROM DBA_DATA_FILES;");
      return;
    }

    // SELECT * FROM DBA_DATA_FILES
    if (cmd.includes("DBA_DATA_FILES") && !cmd.includes("WHERE")) {
      const cf = SIM_DB.controlfile;
      append("RESULTADO:");
      cf.datafiles.forEach(d =>
        append(`${d.file_name} | ${d.size_mb} MB | ${d.status}`)
      );
      append("✅ Observa los estados de los archivos (ONLINE / CORRUPT / OFFLINE).");

      setExplanations([
        {
          title: "LISTAR DATAFILES",
          text: `La vista DBA_DATA_FILES muestra todos los archivos de datos de la base y su estado actual. Permite verificar si alguno está dañado o fuera de línea.`
        },
        {
          title: "BUENA PRÁCTICA",
          text: `Si un archivo está CORRUPT u OFFLINE, la base podría no operar correctamente. Es necesario restaurarlo o usar herramientas de recuperación.`
        }
      ]);
      setExpIndex(0);
      setShowExplanations(true);
      setStep(2);
      setNextCommandTip("👉 Ahora filtra los corruptos con: SELECT FILE_NAME FROM DBA_DATA_FILES WHERE STATUS LIKE '%CORRUPT%';");
      return;
    }

    // SELECT FILE_NAME ... WHERE CORRUPT
    if (cmd.includes("DBA_DATA_FILES") && cmd.includes("WHERE")) {
      const corrupt = SIM_DB.controlfile.datafiles.filter(d =>
        d.status.toUpperCase().includes("CORRUPT")
      );
      append("RESULTADO:");
      corrupt.forEach(c => append(c.file_name));
      append("✅ Has identificado el archivo dañado correctamente.");

      setExplanations([
        {
          title: "FILTRAR ARCHIVOS CORRUPTOS",
          text: `La cláusula WHERE con LIKE '%CORRUPT%' sirve para encontrar datafiles dañados. En sistemas reales, estos deben restaurarse desde un backup o recuperarse con RMAN.`
        }
      ]);
      setExpIndex(0);
      setShowExplanations(true);
      setStep(3);
      setNextCommandTip("👉 Continúa con: SELECT * FROM V$LOG; para revisar los redo logs.");
      return;
    }

    // SELECT * FROM V$LOG
    if (cmd.includes("V$LOG")) {
      const logs = SIM_DB.controlfile.redo_logs;
      append("RESULTADO:");
      logs.forEach(l => append(`SEQ: ${l.seq} | FILE: ${l.file}`));
      append(`CURRENT REDO SEQUENCE: ${SIM_DB.controlfile.current_redo}`);
      append("✅ Observa cuál redo log está activo actualmente.");

      setExplanations(buildRedoExplanations());
      setExpIndex(0);
      setShowExplanations(true);
      setStep(4);
      setNextCommandTip("👉 Ahora aprende los modos de arranque: escribe MAS INFO;");
      return;
    }

    // MAS INFO
    if (cmd.includes("MAS INFO")) {
      append("NOMOUNT, MOUNT y OPEN son los tres estados de arranque de Oracle. Se explicarán a la izquierda.");
      setExplanations(buildMountExplanations());
      setExpIndex(0);
      setShowExplanations(true);
      setStep(5);
      setNextCommandTip("🎯 ¡Excelente! Has completado todos los temas del controlfile. Pulsa abajo para hacer la evaluación final.");
      return;
    }

    append("Comando no reconocido. Escribe HELP para ver opciones.");
  }

  const nextExp = () => {
    if (expIndex < explanations.length - 1) {
      setExpIndex((i) => i + 1);
    } else if (nextCommandTip) {
      append("💬 Explicación finalizada. " + nextCommandTip);
    }
  };

  const prevExp = () => setExpIndex((i) => Math.max(i - 1, 0));
  const closeExplanations = () => setShowExplanations(false);

  if (showQuiz) {
    return <ControlfileQuiz character={character} onBackToFiles={onBack} />;
  }
  

  return (
    <div className="controlfile-wrap">
      <header className="header-small">
        <h1>Oracle Quest — Controlfile</h1>
        <div>
          <button className="back" onClick={onBack}> Volver</button>
        </div>
      </header>

      <div className="controlfile-grid">
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
                <li>Ver nombre BD y fecha creación</li>
                <li>Listar datafiles y redo logs</li>
                <li>Entender NOMOUNT / MOUNT / OPEN</li>
                <li>Identificar redo log actual y checkpoint</li>
              </ul>
            </div>

            <div className="explain-shell">
              {!showExplanations ? (
                <div className="explain-preview">
                  <p className="explain-title">Guía interactiva</p>
                  <p className="explain-sub">
                    Ejecuta <code>SHOW CONTROLFILE;</code> para comenzar.
                  </p>
                </div>
              ) : (
                <div className="explain-detail">
                  <div className="explain-head">
                    <strong>{explanations[expIndex]?.title}</strong>
                    <span className="exp-count">{expIndex + 1}/{explanations.length}</span>
                  </div>
                  <div className="explain-body">
                    <pre className="explain-text">{explanations[expIndex]?.text}</pre>
                  </div>
                  <div className="explain-controls">
                    <button onClick={prevExp} disabled={expIndex === 0}>← Anterior</button>
                    {expIndex < explanations.length - 1 && (
                      <button onClick={nextExp}>Siguiente →</button>
                    )}
                    <button onClick={closeExplanations} className="close-exp">Cerrar</button>
                  </div>
                </div>
              )}
            </div>

            {nextCommandTip && (
              <div className="next-tip">
                <p><b>Siguiente paso:</b></p>
                <p>{nextCommandTip}</p>
              </div>
            )}

            {step >= 5 && (
              <div className="evaluation-box">
                <button
                  className="eval-btn"
                  onClick={() => setShowQuiz(true)}
                >
                Realizar Evaluación Final
                </button>
              </div>
            )}
          </div>
        </aside>

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
                placeholder="Escribe un comando (ej. SHOW CONTROLFILE;)"
                onKeyDown={(e) => e.key === "Enter" && runCommand(input)}
              />
              <div className="term-buttons">
                <button onClick={() => runCommand(input)}>Ejecutar</button>
                <button onClick={() => { setOutput([]); append("Consola limpia."); }}>Limpiar</button>
              </div>
            </div>
            <div className="terminal-footer">
              <div>Progreso: {step}/5</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
