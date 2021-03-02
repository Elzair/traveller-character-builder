import logo from './logo.svg';
import './App.css';
import { useDrag } from 'react-dnd';
import { r2d6 } from './utils';
import { UPP } from './UPP';
import { useState } from 'react';
import { Homeworld } from './Homeworld';
import { Game } from './Game';
import { Career } from './Career';
import { Log } from './Log';


function App() {
  // let stats = generateCharacteristics();
  let [step, setStep] = useState(0);
  let [upp, setUpp] = useState(generateUPP());
  let [homeworldName, setHomeworldName] = useState('');
  let [homeworldUPP, setHomeworldUPP] = useState(generateUWP());
  let [name, setName] = useState('');
  let [game, setGame] = useState("classic");
  let [options, setOptions] = useState({ rearrangeCharacteristics: false, });
  let [career, setCareer] = useState(null);
  let [log, setLog] = useState([]);

  // Update State Functions
  function updateGameOptions(opts) {
    let newopts = {};
    for (let opt in options) {
      if (options.hasOwnProperty(opt)) {
        newopts[opt] = options[opt];
      }
    }

    for (let opt in opts) {
      if (opts.hasOwnProperty(opt)) {
        newopts[opt] = opts[opt];
      }
    }

    setOptions(newopts);
  }

  function updateUPP(updated) {
    let newchars = {};
    for (let char in upp) {
      if (upp.hasOwnProperty(char)) {
        newchars[char] = upp[char];
      }
    }

    for (let char in updated) {
      if (updated.hasOwnProperty(char)) {
        newchars[char] = updated[char];
      }
    }

    setUpp(newchars);
  }

  function updateCareer(updated) {
    let newcareer = {};
    for (let opt in career) {
      if (career.hasOwnProperty(opt)) {
        newcareer[opt] = career[opt];
      }
    }

    for (let opt in updated) {
      if (updated.hasOwnProperty(opt)) {
        newcareer[opt] = updated[opt];
      }
    }

    setCareer(newcareer);
  }

  function updateLog(newEntries) {
    let newlog = [];
    for (let oldEntry of log) {
      newlog.push(oldEntry);
    }
    for (let newEntry of newEntries) {
      newlog.push(newEntry);
    }

    setLog(newlog);
  }

  // Finish Step Options
  function finishGameOptions() {
    setStep(1);
  }

  return (
    <div id="App" className="App">
      <Game 
        name={name} 
        setName={setName} 
        game={game} 
        setGame={setGame} 
        // step={step} 
        // setStep={setStep}
        display={step===0}
        finish={finishGameOptions}
        options={options}
        updateOptions={updateGameOptions}
        updateLog={updateLog}
      />
      <p className="Name">{name}</p>
      <UPP 
        options={options} 
        updateOptions={updateGameOptions} 
        characteristics={upp} 
        updateUPP={updateUPP} 
        step={step}
        setStep={setStep}
        updateLog={updateLog}
      />
      <Career 
        game={game} 
        step={step} 
        setStep={setStep} 
        career={career} 
        updateCareer={updateCareer} 
        upp={upp} 
        setUpp={updateUPP}
        updateLog={updateLog} 
      />
      <Log log={log} />
      {/* <Homeworld name={homeworldName} updateName={setHomeworldName} upp={homeworldUPP} updateUPP={setHomeworldUPP} /> */}
    </div>
    
  );
}

function generateUPP() {
  let characteristics = {
    Strength: r2d6(),
    Dexterity: r2d6(),
    Endurance: r2d6(),
    Intellect: r2d6(),
    Education: r2d6(),
    Social: r2d6(),
  };

  return characteristics;
}

function generateUWP() {
  return {
    Starport: 8, 
    Size: 8,
    Atmosphere: 8,
    Hydrographics: 8,
    Population: 8,
    Government: 8,
    LawLevel: 8,
    TechLevel: 8,
  };
}

export default App;
