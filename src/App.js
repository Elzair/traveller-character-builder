import logo from './logo.svg';
import './App.css';
import { capitalize, num2tetra, r2d6 } from './utils';
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

import CTCAREERS from './data/ct/careers';

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
  let [numSkillRolls, setNumSkillRolls] = useState(1);
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
    let uppStr = Object.entries(upp).map(ent => num2tetra(ent[1])).join('');
    updateLog([`Your Universal Personality Profile is ${uppStr}.`]);
    setStep(2);
  }

  function enlisted({branch, term, rank}) {
    if (game === 'classic') {
      const careerData = CTCAREERS.filter(c => branch === c.name)[0];
      const numSkillRolls = careerData.numSkillsPerTerm;
      setNumSkillRolls(numSkillRolls);
      updateCareer({branch, term, rank, drafted: false});
      updateLog([`Congratulations! You have enlisted in the ${capitalize(branch)}!`]);
    }
    setStep(3);
  }

  function drafted({branch, failedBranch, term, rank}) {
    if (game === 'classic') {
      const careerData = CTCAREERS.filter(c => branch === c.name)[0];
      const numSkillRolls = careerData.numSkillsPerTerm;
      setNumSkillRolls(numSkillRolls);
      updateCareer({branch, term, rank, drafted: true});
      updateLog([
        `Sorry! You did not qualify for the ${capitalize(failedBranch)}.`,
        `Instead, you were drafted into the ${capitalize(branch)}.`,
      ]);
    }
    setStep(3);
  }

  function survived() {
    updateLog([`You survived term ${career.term+1}.`]);
    updateCareer({term: career.term+1});
    if (game === 'classic') {
      const careerData = CTCAREERS.filter(c => career.branch === c.name)[0];
      // Reset the number of skill rolls for the term.
      setNumSkillRolls(careerData.numSkillsPerTerm);

      // If the career does not have commissions or advancements, go to skill rolls.
      // Also go to skill rolls if the character was drafted and its their first term.
      if (careerData.commission === null || (career.drafted === true && career.term+1 === 1)) {
        setStep(6);
      } else if (career.rank >= 1) { // Go directly to promotion if a commission has already been earned.
        setStep(5);
      } else {
        setStep(4);
      }
    } else {
      setStep(4);
    }
  }

  function commissioned() {
    if (game === 'classic') {
      const careerData = CTCAREERS.filter(c => career.branch === c.name)[0];
      updateLog([`Congratulations! You are now a Rank 1 ${careerData.ranks[1].name}.`]);
    }
    updateCareer({rank: 1});
    setNumSkillRolls(numSkillRolls+1);
    setStep(5);
  }
  
  function commissionFailed() {
    updateLog([`Sorry, you failed to get a commission in term ${career.term}.`]);
    setStep(6);
  }

  function commissionNotAttempted() {
    updateLog([`You did not attempt a commission in term ${career.term}.`]);
    setStep(6);
  }

  function promoted() {
    let rank = career.rank+1;
    if (game === 'classic') {
      const careerData = CTCAREERS.filter(c => career.branch === c.name)[0];
      updateLog([`Congratulations! You are now a Rank ${rank} ${careerData.ranks[rank].name}.`]);
    }
    updateCareer({rank: rank});
    setNumSkillRolls(numSkillRolls+1);
    setStep(6);
  }

  function notPromoted() {
    updateLog([`Sorry, you failed to get a promotion in term ${career.term}.`]);
    setStep(6);
  }

  function promotionNotAttempted() {
    updateLog([`You did not attempt a promotion in term ${career.term}.`]);
    setStep(6);
  }

  function choseSkill() {
    setNumSkillRolls(numSkillRolls-1);
    if (numSkillRolls-1 > 0) {
      setStep(6);
    } else {
      setStep(8);
    }
  }

  function cascadeSkill() {
    setStep(7);
  }

  function died() {
    updateLog([`You have died.`]);
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
        upp={upp} 
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
        onNoAttempt={commissionNotAttempted}
        updateLog={updateLog}
      />
      <Promotion
        game={game}
        upp={upp}
        career={career}
        updateCareer={updateCareer}
        display={step===5}
        onSuccess={promoted}
        onFailure={notPromoted}
        onNoAttempt={promotionNotAttempted}
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
