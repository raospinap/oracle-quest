import React, { useState } from "react";
import "./ControlfileQuiz.css";

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

// 10 preguntas completas
const preguntas = [
  {
    texto: "¿Qué almacena el archivo controlfile?",
    opciones: [
      "Solo los usuarios de la base de datos",
      "La estructura de la base, datafiles y redo logs",
      "Los registros de transacciones antiguas",
      "El historial de consultas SQL",
    ],
    correcta: 1,
    pista:
      "El controlfile guarda la estructura física de la base: nombres de datafiles, redo logs y estado de la base de datos.",
  },
  {
    texto: "¿Qué sucede si se pierde el archivo controlfile?",
    opciones: [
      "La base de datos sigue funcionando normal",
      "La base de datos no puede montarse ni abrirse",
      "Solo se pierden los datos de usuarios",
      "No pasa nada, Oracle lo recrea automáticamente",
    ],
    correcta: 1,
    pista:
      "El controlfile es esencial para el arranque; sin él, Oracle no puede montar ni abrir la base de datos.",
  },
  {
    texto: "¿Qué comando se usa para ver la ubicación del controlfile?",
    opciones: [
      "SHOW CONTROLFILE",
      "SHOW PARAMETER CONTROL_FILES",
      "SELECT * FROM V$DATAFILE;",
      "SHOW CONTROL_FILES LOCATION;",
    ],
    correcta: 1,
    pista: "Puedes verificar la ruta del controlfile con: SHOW PARAMETER CONTROL_FILES.",
  },
  {
    texto: "¿Qué tipo de información guarda el controlfile?",
    opciones: [
      "Solo nombres de usuarios",
      "Información de estructura física y estado de la base de datos",
      "Consultas realizadas",
      "Procedimientos almacenados",
    ],
    correcta: 1,
    pista:
      "Guarda nombres y ubicaciones de datafiles, redo logs, SCN y estado del sistema.",
  },
  {
    texto: "¿Cuántos controlfiles recomienda Oracle por seguridad?",
    opciones: ["Uno", "Dos o más copias", "Tres obligatorios", "Cinco"],
    correcta: 1,
    pista: "Oracle recomienda tener al menos dos copias para evitar pérdida de datos.",
  },
  {
    texto: "¿Qué sucede al crear una base de datos nueva?",
    opciones: [
      "Se genera automáticamente el controlfile",
      "Debe crearse manualmente",
      "Se copia desde otra base",
      "No se usa controlfile",
    ],
    correcta: 0,
    pista: "El controlfile se genera automáticamente al crear la base de datos.",
  },
  {
    texto: "¿Dónde se define la ruta del controlfile?",
    opciones: [
      "En el archivo tnsnames.ora",
      "En el parámetro CONTROL_FILES del spfile o pfile",
      "En el listener",
      "En el archivo alert.log",
    ],
    correcta: 1,
    pista:
      "El parámetro CONTROL_FILES define las rutas donde se almacenan los controlfiles.",
  },
  {
    texto: "¿Qué comando permite respaldar el controlfile?",
    opciones: [
      "ALTER DATABASE BACKUP CONTROLFILE TO TRACE;",
      "BACKUP CONTROLFILE;",
      "EXPORT CONTROLFILE;",
      "SHOW BACKUP CONTROLFILE;",
    ],
    correcta: 0,
    pista: "Puedes crear una copia con: ALTER DATABASE BACKUP CONTROLFILE TO TRACE;",
  },
  {
    texto: "¿Qué pasa si un controlfile se daña y existen copias?",
    opciones: [
      "Se puede restaurar desde otra copia válida",
      "Se debe reinstalar Oracle",
      "No se puede hacer nada",
      "La base se elimina",
    ],
    correcta: 0,
    pista:
      "Si hay copias, se puede restaurar desde una de ellas, asegurando la continuidad del sistema.",
  },
  {
    texto: "¿Qué vista muestra información detallada del controlfile?",
    opciones: [
      "V$CONTROLFILE",
      "DBA_CONTROL",
      "V$DATABASE",
      "SHOW CONTROLFILE DETAILS;",
    ],
    correcta: 0,
    pista: "Puedes consultar detalles con: SELECT * FROM V$CONTROLFILE;",
  },
];

const ControlfileQuiz = ({ character, onBackToFiles }) => {

  const personajeClave = (() => {
    if (!character) return "viejo";
    switch (character.name) {
      case "Viejo Sabroso":
        return "viejo";
      case "Marc Anthony":
        return "marc";
      case "El Motivador":
        return "motivador";
      case "Reclutadora de Gays":
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
  const [bloqueado, setBloqueado] = useState(false);
  const [resultadoVisible, setResultadoVisible] = useState(false); // controla cuándo mostrar colores


  const actual = preguntas[indice];

  const comprobar = () => {
    if (seleccion === null) return;

    // Mostrar el resultado visual
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
      setResultadoVisible(false); // resetea visualización de colores
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
          <h1 className="result-title">Evaluación Final — Controlfile</h1>
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
      <h2 className="quiz-title">Evaluación: Archivos Controlfile</h2>
      <div className="question-layout">
        <div className="character-side">
          <img src={p.img} alt={p.nombre} className="char-avatar" />
          {mensaje && (
            <div
              className={`speech-bubble ${seleccion === actual.correcta ? "good" : "bad"
                }`}
            >
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

export default ControlfileQuiz;
