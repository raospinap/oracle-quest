import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import CharacterSelect from "./components/CharacterSelect";
import FileSelect from "./components/FileSelect";
import ControlfileScreen from "./components/ControlfileScreen";
import ControlfileQuiz from "./components/ControlfileQuiz";
import TablespaceScreen from "./components/TablespaceScreen";
import TablespaceQuiz from "./components/TablespaceQuiz";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const handleRestart = () => {
    setScreen("home");
    setSelectedCharacter(null);
    setSelectedFile(null);
  };

  return (
    <>
      {/* Pantalla de inicio */}
      {screen === "home" && (
        <HomeScreen onStartAdventure={() => setScreen("characterSelect")} />
      )}

      {/*  Selección de personaje */}
      {screen === "characterSelect" && (
        <CharacterSelect
          onSelectCharacter={(char) => {
            setSelectedCharacter(char);
            setScreen("fileSelect");
          }}
          onBack={handleRestart}
        />
      )}

      {/*  Selección de archivo */}
      {screen === "fileSelect" && (
        <FileSelect
          character={selectedCharacter?.name ?? "Jugador"}
          onSelectFile={(file) => {
            setSelectedFile(file);

            // Aquí agregamos el flujo correcto para cada archivo
            if (file.name.toLowerCase() === "controlfile") {
              setScreen("controlfile");
            } else if (file.name.toLowerCase() === "datafile") {
              setScreen("tablespace"); 
              alert("Aún no implementado");
            }
          }}
          onBack={() => setScreen("characterSelect")}
        />
      )}

      {/*  Pantalla del archivo Controlfile */}
      {screen === "controlfile" && (
        <ControlfileScreen
          character={selectedCharacter}
          onBack={() => setScreen("fileSelect")}
          onEval={() => setScreen("evaluation")}
        />
      )}

      {/* Pantalla del archivo Datafile / Tablespace */}
      {screen === "tablespace" && (
        <TablespaceScreen
          character={selectedCharacter}
          onBack={() => setScreen("fileSelect")}
        />
      )}

      {/*Evaluación tipo quiz */}
      {screen === "evaluation" && (
        <ControlfileQuiz
          character={selectedCharacter}
          onBackToFiles={() => setScreen("fileSelect")}
        />
      )}
      {screen === "tablespaceQuiz" && (
        <TablespaceQuiz
          character={selectedCharacter}
          onBackToFiles={() => setScreen("fileSelect")}
        />
      )}

    </>
  );
}
