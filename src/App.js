import logo from './logo.svg';
import './App.css';
import { r2d6 } from './utils';
import { UPP } from './UPP';
import { useState } from 'react';
import { Homeworld } from './Homeworld';
import { Game } from './Game';
import { Career } from './Career';
import { Log } from './Log';
import { Survival } from './Survival';
import { Commission } from './Commission';
import { Promotion } from './Promotion';
import { Skill } from './Skill';
import { Character } from './Character';


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
  let [skills, setSkills] = useState({});
  let [age, setAge] = useState(18);
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

    setUpp(newchars); // TODO: Capitalize this
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

  function updateSkills(updated) {
    let newskills  = {};
    for (let opt in skills) {
      if (skills.hasOwnProperty(opt)) {
        newskills[opt] = skills[opt];
      }
    }

    for (let opt in updated) {
      if (updated.hasOwnProperty(opt)) {
        newskills[opt] = updated[opt];
      }
    }

    setSkills(newskills);
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

  function finalizeUPP() {
    setStep(2);
  }

  function enlisted() {
    setStep(3);
  }

  function drafted() {
    setStep(6);
  }

  function survived() {
    setStep(4);
  }

  function commissioned() {
    setStep(5);
  }
  
  function commissionFailed() {
    setStep(6);
  }

  function promotedOrNot() {
    setStep(6);
  }

  function choseSkill() {
    setStep(8);
  }

  function cascadeSkill() {
    setStep(7);
  }

  function died() {
    setStep(10);
  }

  return (
    <div id="App" className="App">
      <Game 
        name={name} 
        setName={setName} 
        game={game} 
        setGame={setGame} 
        display={step===0}
        onFinished={finishGameOptions}
        options={options}
        updateOptions={updateGameOptions}
        updateLog={updateLog}
      />
      <Character 
        game={game}
        name={name}
        career={career}
        upp={upp}
        skills={skills}
        age={age}
        display={step>0}
      />
      <UPP 
        options={options} 
        updateOptions={updateGameOptions} 
        characteristics={upp} 
        updateUPP={updateUPP} 
        display={step===1}
        onFinalized={finalizeUPP}
        updateLog={updateLog}
      />
      <Career 
        game={game} 
        career={career} 
        updateCareer={updateCareer} 
        upp={upp} 
        setUpp={updateUPP}
        display={step===2}
        onEnlistment={enlisted}
        onDraft={drafted}
        updateLog={updateLog}
      />
      <Survival
        game={game}
        upp={upp}
        career={career}
        display={step===3}
        onSurvival={survived}
        onDeath={died}
        updateLog={updateLog}
      />
      <Commission
        game={game}
        upp={upp}
        career={career}
        updateCareer={updateCareer}
        display={step===4}
        onSuccess={commissioned}
        onFailure={commissionFailed}
        updateLog={updateLog}
      />
      <Promotion
        game={game}
        upp={upp}
        career={career}
        updateCareer={updateCareer}
        display={step===5}
        onSuccess={promotedOrNot}
        onFailure={promotedOrNot}
        updateLog={updateLog}
      />
      <Skill
        game={game}
        upp={upp}
        updateUPP={updateUPP} 
        career={career}
        skills={skills}
        updateSkills={updateSkills}
        display={step===6 || step===7}
        onSelected={choseSkill}
        onCascade={cascadeSkill}
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
