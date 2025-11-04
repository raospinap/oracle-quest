import React, { useState } from "react";
import "./ControlfileQuiz.css"; // usamos el mismo estilo para mantener coherencia

import viejo from "../assets/rolando_avatar.png";
import marc from "../assets/santiago_avatar.png";
import motivador from "../assets/amaya_avatar.png";
import reclutadora from "../assets/daniela_avatar.png";

const personajes = {
  viejo: {
    nombre: "Viejo Sabroso",
    img: viejo,
    frases: {
      correcto: ["Es correcto, lo entendiste bien.", "Muy bien, felicidades."],
      incorrecto: ["¿Está seguro de eso?", "Yo sé que usted puede, vuelva a hacerlo."],
      finalAlto: "Le dije que podía, vea que sí sabe.",
      finalBajo: "Eso no salió como esperaba, pero no se rinda.",
    },
  },
  marc: {
    nombre: "Marc Anthony",
    img: marc,
    frases: {
      correcto: ["Bien chin@, lo hizo bien.", "Esa sí fue con flow."],
      incorrecto: ["Hágale, vuelva a intentarlo.", "Nah, no era por ahí."],
      finalAlto: "¡Durísimo, me le quito el sombrero!",
      finalBajo: "Bueno, se intentó, pero hay que practicar más.",
    },
  },
  motivador: {
    nombre: "El Motivador",
    img: motivador,
    frases: {
      correcto: ["¡Bien jugador, bien!", "Estoy orgulloso de usted."],
      incorrecto: ["¡Pero qué hizo!", "No, ya la embarró, concéntrese."],
      finalAlto: "¡Así se hace! Victoria total.",
      finalBajo: "Tranquilo, campeón. Se cae, pero se levanta.",
    },
  },
  reclutadora: {
    nombre: "La Reclutadora",
    img: reclutadora,
    frases: {
      correcto: ["Epa, es correcto.", "Por fin"],
      incorrecto: ["¿Ud es o se hace? Vuelva a intentarlo.", "Ay no, qué oso."],
      finalAlto: "Divino, 100% reclutable.",
      finalBajo: "Ni para pasarela, pero bueno, se intentó.",
    },
  },
};
// 🧠 10 preguntas sobre Datafiles / Tablespaces
const preguntas = [
  {
    texto: "¿Qué es un Datafile en Oracle?",
    opciones: [
      "Un archivo que guarda los datos de usuario y del sistema",
      "Un archivo de configuración",
      "Un registro de transacciones",
      "Una copia de respaldo del controlfile",
    ],
    correcta: 0,
    pista:
      "Cada tablespace está formado por uno o más datafiles, donde realmente se almacenan los datos.",
  },
  {
    texto: "¿Qué es un Tablespace?",
    opciones: [
      "Una tabla temporal",
      "Un contenedor lógico de datafiles",
      "Una carpeta del sistema operativo",
      "Un usuario especial de Oracle",
    ],
    correcta: 1,
    pista:
      "Un tablespace organiza lógicamente los datafiles donde se almacenan los datos.",
  },
  {
    texto: "¿Cómo se puede ver la lista de datafiles de la base de datos?",
    opciones: [
      "SHOW DATAFILES;",
      "SELECT NAME FROM V$DATAFILE;",
      "DESC DBA_DATAFILES;",
      "LIST DATAFILES;",
    ],
    correcta: 1,
    pista: "Puedes usar: SELECT NAME FROM V$DATAFILE; para ver los archivos de datos.",
  },
  {
    texto: "¿Cuál es el tablespace principal del sistema?",
    opciones: ["SYSTEM", "USERS", "UNDO", "TEMP"],
    correcta: 0,
    pista:
      "El tablespace SYSTEM contiene las estructuras fundamentales de la base de datos.",
  },
  {
    texto: "¿Qué comando crea un nuevo tablespace?",
    opciones: [
      "CREATE DATAFILE;",
      "CREATE TABLESPACE users DATAFILE 'ruta.dbf' SIZE 100M;",
      "ADD DATAFILE 'ruta.dbf';",
      "ALTER SYSTEM ADD TABLESPACE;",
    ],
    correcta: 1,
    pista:
      "El comando CREATE TABLESPACE permite crear un nuevo espacio lógico con su datafile asociado.",
  },
  {
    texto: "¿Qué sucede si un datafile se daña?",
    opciones: [
      "Oracle puede dejar el tablespace offline",
      "Se elimina la base de datos completa",
      "Solo se afectan las tablas temporales",
      "No pasa nada hasta reiniciar",
    ],
    correcta: 0,
    pista:
      "Cuando un datafile falla, Oracle puede marcar el tablespace como offline para proteger los datos.",
  },
  {
    texto: "¿Dónde se definen las rutas de los datafiles?",
    opciones: [
      "En el parámetro DB_FILES",
      "En los comandos CREATE o ALTER TABLESPACE",
      "En el archivo listener.ora",
      "En el archivo tnsnames.ora",
    ],
    correcta: 1,
    pista:
      "Las rutas de los datafiles se especifican al crear o modificar tablespaces.",
  },
  {
    texto: "¿Qué vista muestra información sobre los tablespaces?",
    opciones: [
      "V$TABLESPACE",
      "DBA_TABLES",
      "V$TABLES",
      "SHOW TABLESPACE;",
    ],
    correcta: 0,
    pista: "Puedes consultar información con: SELECT * FROM V$TABLESPACE;",
  },
  {
    texto: "¿Qué comando permite añadir un nuevo datafile a un tablespace existente?",
    opciones: [
      "ALTER DATABASE ADD DATAFILE;",
      "ALTER TABLESPACE ADD DATAFILE;",
      "ADD DATAFILE TO DATABASE;",
      "CREATE DATAFILE;",
    ],
    correcta: 1,
    pista:
      "Puedes ampliar un tablespace con: ALTER TABLESPACE users ADD DATAFILE 'ruta.dbf' SIZE 50M;",
  },
  {
    texto: "¿Qué tipo de tablespace se usa para operaciones temporales?",
    opciones: ["SYSTEM", "UNDO", "TEMP", "USERS"],
    correcta: 2,
    pista:
      "El tablespace TEMP almacena datos temporales de consultas y ordenamientos.",
  },
];

const TablespaceQuiz = ({ character, onBackToFiles }) => {
  const personajeClave = (() => {
    if (!character) return "viejo";
    switch (character.name) {
      case "Viejo Sabroso":
        return "viejo";
      case "Marc Anthony":
        return "marc";
      case "El Motivador":
        return "motivador";
      case "Reclutadora":
        return "reclutadora";
      default:
        return "viejo";
    }
  })();

  const p = personajes[personajeClave];
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [finalizado, setFinalizado] = useState(false);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [resultadoVisible, setResultadoVisible] = useState(false);

  const actual = preguntas[indice];

  const comprobar = () => {
    if (seleccion === null) return;
    setResultadoVisible(true);

    if (seleccion === actual.correcta) {
      setPuntaje(puntaje + 1);
      setMensaje(p.frases.correcto[Math.floor(Math.random() * 2)]);
      setMostrarPista(false);
    } else {
      setMensaje(p.frases.incorrecto[Math.floor(Math.random() * 2)]);
      setMostrarPista(true);
    }
  };

  const siguiente = () => {
    if (indice + 1 < preguntas.length) {
      setIndice(indice + 1);
      setSeleccion(null);
      setMensaje("");
      setMostrarPista(false);
      setResultadoVisible(false);
    } else {
      setFinalizado(true);
    }
  };

  const reiniciar = () => {
    setIndice(0);
    setSeleccion(null);
    setPuntaje(0);
    setMensaje("");
    setFinalizado(false);
    setMostrarPista(false);
  };

  if (finalizado) {
    const exito = puntaje >= 7;
    const fraseFinal = exito ? p.frases.finalAlto : p.frases.finalBajo;
    return (
      <div className="quiz-container flex flex-col items-center justify-center text-center">
        <div className="result-block">
          <img src={p.img} alt={p.nombre} className="char-avatar mb-6" />
          <h1 className="result-title">Evaluación Final — Datafile / Tablespace</h1>
          <p className="text-xl mb-2">Tu puntaje: {puntaje}/10</p>
          <p className="end-phrase">{fraseFinal}</p>

          <div className="button-group">
            <button className="retry-btn" onClick={reiniciar}>
              Repetir evaluación
            </button>
            <button className="back-btn" onClick={onBackToFiles}>
              Volver a selección
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Evaluación: Datafile / Tablespace</h2>
      <div className="question-layout">
        <div className="character-side">
          <img src={p.img} alt={p.nombre} className="char-avatar" />
          {mensaje && (
            <div className={`speech-bubble ${seleccion === actual.correcta ? "good" : "bad"}`}>
              {mensaje}
            </div>
          )}
        </div>

        <div className="question-side">
          <p className="question-text">
            {indice + 1}. {actual.texto}
          </p>
          <div className="options">
            {actual.opciones.map((op, i) => (
              <button
                key={i}
                onClick={() => setSeleccion(i)}
                className={`option-btn ${seleccion === i ? "selected" : ""}`}
              >
                {String.fromCharCode(65 + i)}. {op}
              </button>
            ))}
          </div>

          {mostrarPista && (
            <div className="hint-box">
              <strong>Pista:</strong> {actual.pista}
            </div>
          )}

          <div className="button-group">
            <button className="submit-btn" onClick={comprobar}>
              Comprobar
            </button>
            <button className="submit-btn" onClick={siguiente}>
              Siguiente
            </button>
          </div>

          <p className="text-sm mt-4 text-gray-300">
            Pregunta {indice + 1} de {preguntas.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TablespaceQuiz;
