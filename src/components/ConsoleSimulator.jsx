import { useState } from "react";
import "./ConsoleSimulator.css";

/**
 * ConsoleSimulator props:
 *  - expectedCommands: array of acceptable normalized commands (upper-case, no ;),
 *    or null if no command expected.
 *  - onSuccess(cmd): callback when command matches expected.
 *  - step: step metadata to show on top.
 */
export default function ConsoleSimulator({ expectedCommands, onSuccess, step }) {
  const [input, setInput] = useState("");
  const [outputLines, setOutputLines] = useState([
    "Simulación Oracle — consola educativa (no ejecuta DB real).",
    "Escribe HELP para ver comandos válidos."
  ]);

  const appendOutput = (text) => {
    setOutputLines((o) => [...o, text]);
  };

  const normalize = (s) => s.trim().replace(/\s+/g, " ").replace(/;$/, "").toUpperCase();

  const handleRun = () => {
    const raw = input;
    const cmd = normalize(raw);
    appendOutput(`> ${raw}`);

    if (!cmd) {
      appendOutput("No has escrito un comando.");
      setInput("");
      return;
    }

    if (cmd === "HELP" || cmd === "?" || cmd === "SHOW HELP") {
      appendOutput("Comandos válidos (simulados): SHOW CONTROLFILE; SELECT * FROM V$CONTROLFILE; SELECT * FROM DBA_DATA_FILES; SELECT * FROM V$LOG; SHOW CHECKPOINT;");
      setInput("");
      return;
    }

    // If no expected commands for this step (read-only), alert
    if (!expectedCommands || expectedCommands.length === 0) {
      appendOutput("Esta etapa no requiere comandos. Usa Siguiente en el panel izquierdo.");
      setInput("");
      return;
    }

    // Try to match any expected command substring
    const ok = expectedCommands.some((ec) => {
      const normEc = ec.replace(/;$/, "").toUpperCase();
      return cmd.includes(normEc) || normEc.includes(cmd);
    });

    if (ok) {
      // Simulated results depending on command
      if (cmd.includes("SHOW CONTROLFILE") || cmd.includes("V$CONTROLFILE")) {
        appendOutput("CONTROLFILE: NAME='control01.ctl' | STATUS=NORMAL | CHECKPOINT=SCN 123456");
        appendOutput("DATAFILES: users01.dbf (ONLINE), orders01.dbf (ONLINE), products01.dbf (OFFLINE - CORRUPT)");
      } else if (cmd.includes("SELECT") && cmd.includes("V$DATABASE")) {
        appendOutput("NAME='ORCL' | CREATED='2023-05-12 08:23:45'");
      } else if (cmd.includes("V$LOG") || (cmd.includes("GROUP#") && cmd.includes("V$LOG"))) {
        appendOutput("GROUP# 1 STATUS=ACTIVE | GROUP# 2 STATUS=UNUSED | CURRENT REDO LOG: GROUP# 1");
      } else if (cmd.includes("DBA_DATA_FILES") || cmd.includes("DATA_FILES") || cmd.includes("FILE_NAME")) {
        appendOutput("FILE_NAME: /u01/app/oracle/oradata/users01.dbf");
        appendOutput("FILE_NAME: /u01/app/oracle/oradata/orders01.dbf");
        appendOutput("FILE_NAME: /u01/app/oracle/oradata/products01.dbf (OFFLINE - CORRUPT)");
      } else if (cmd.includes("SHOW CHECKPOINT") || cmd.includes("V$INSTANCE") || cmd.includes("CHECKPOINT")) {
        appendOutput("CHECKPOINT SCN: 123456 | LAST_ARCHIVE: YES | FAST_START_MTTR_TARGET: 300");
      } else {
        appendOutput("Comando reconocido y ejecutado (simulado). Revisa la salida en pantalla.");
      }

      // success callback after showing results
      if (onSuccess) onSuccess(cmd);
    } else {
      appendOutput("Comando no reconocido para este paso. Usa HELP para ver comandos válidos o revisa la pista.");
    }

    setInput("");
  };

  return (
    <div className="console-sim">
      <div className="console-header">
        <div className="console-title">{step.title}</div>
        <div className="console-sub">{step.explanationShort}</div>
      </div>

      <div className="console-output" id="console-output">
        {outputLines.map((l, i) => (
          <div key={i} className="console-line">{l}</div>
        ))}
      </div>

      <div className="console-input">
        <input
          type="text"
          placeholder="Escribe el comando aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRun();
          }}
        />
        <button onClick={handleRun}>▶ Ejecutar</button>
      </div>
    </div>
  );
}
