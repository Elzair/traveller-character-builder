import React from 'react';
import { useState } from 'react';
// import logo from './logo.svg';

import './App.css';

import { capitalize, num2tetra, r2d6, updateObject } from './utils';

import { UPP } from './UPP';
// import { Homeworld } from './Homeworld';
import { Game } from './Game';
import { Career } from './Career';
import { Log } from './Log';
import { Survival } from './Survival';
import { Commission } from './Commission';
import { Promotion } from './Promotion';
import { Skill } from './Skill';
import { Character } from './Character';
import { Age } from './Age';
import { Reenlist } from './Reenlist';
import { MusterOut } from './MusterOut';

import CTCAREERS from './data/ct/careers';

// eslint-disable-next-line
const STEPS = [
  'GAME',
  'UPP',
  'HOMEWORLD',
  'CAREER',
  'SURVIVAL',
  'COMMISSION',
  'PROMOTION',
  'SKILL',
  'AGE',
  'REENLISTMENT',
  'MUSTER-OUT',
  'FINISHED',
  'END'
]

function App() {
  // let stats = generateCharacteristics();
  let [step, setStep] = useState('GAME');
  let [upp, setUPP] = useState(generateUPP());
  // let [homeworldName, setHomeworldName] = useState('');
  // let [homeworldUPP, setHomeworldUPP] = useState(generateUWP());
  let [name, setName] = useState('');
  let [game, setGame] = useState("classic");
  let [options, setOptions] = useState({ rearrangeCharacteristics: false, });
  let [career, setCareer] = useState(null);
  let [skills, setSkills] = useState({});
  let [age, setAge] = useState(18);
  // let [numSkillRolls, setNumSkillRolls] = useState(1);
  let [credits, setCredits] = useState(0);
  let [items, setItems] = useState({});
  let [log, setLog] = useState([]);

  // Update State Functions
  function updateGameOptions(opts) {
    setOptions(updateObject(options, opts));
  }

  function updateUPP(updated) {
    setUPP(updateObject(upp, updated));
  }

  function updateCareer(updated) {
    setCareer(updateObject(career, updated));
  }

  function updateSkills(updated) {
    setSkills(updateObject(skills, updated));
  }

  function updateItems(updated) {
    let newItems = {};
    for (let item in items) {
      if (items.hasOwnProperty(item)) {
        newItems[item] = items[item];
      }
    }

    for (let item in updated) {
      if (updated.hasOwnProperty(item)) {
        if (newItems.hasOwnProperty(item)) {
          newItems[item] += updated[item];
        } else {
          newItems[item] = updated[item];
        }
      }
    }

    setItems(newItems);
  }

  function updateLog(newEntries) {
    const newLog = log.concat(newEntries);
    setLog(newLog);
  }

  // Finish Step Options
  function finishGameOptions(game, name) {
    updateLog([`You have selected ${game}.`, `Your name is ${name}.`]);
    setStep('UPP');
  }

  function finalizeUPP() {
    let uppStr = Object.entries(upp).map(ent => num2tetra(ent[1])).join('');
    updateLog([`Your Universal Personality Profile is ${uppStr}.`]);
    setStep('CAREER');
  }

  function enlisted({branch, term, rank}) {
    updateCareer({branch, term, rank, drafted: false, rankPrev: 0});
    setStep('SURVIVAL');
  }

  function drafted({branch, failedBranch, term, rank}) {
    updateCareer({branch, term, rank, drafted: true, rankPrev: 0});
    setStep('SURVIVAL');
  }

  function survived() {
    updateLog([`You survived term ${career.term+1}.`]);
    updateCareer({term: career.term+1});

    if (game === 'classic') {
      const careerData = CTCAREERS.filter(c => career.branch === c.name)[0];

      // If the career does not have commissions or advancements, go to skill rolls.
      // Also skip commission & promotion if the traveller was drafted and its their first term.
      if (careerData.commission === null || (career.drafted === true && career.term+1 === 1)) {
        setStep('SKILL');
      } else if (career.rank >= 1 && career.rank < careerData.ranks.length-1) { // Go directly to promotion if a commission has already been earned
        setStep('PROMOTION');                                                   // and the traveller has not yet achieved the maximum rank.
      } else {
        setStep('COMMISSION');
      }
    } else {
      setStep('NOT-IMPLEMENTED');
    }
  }

  function commissioned() {
    if (game === 'classic') {
      updateCareer({ rank: 1 });
    }

    setStep('PROMOTION');
  }
  
  function commissionFailed() {
    updateLog([`Sorry, you failed to get a commission in term ${career.term}.`]);
    setStep('SKILL');
  }

  function commissionNotAttempted() {
    updateLog([`You did not attempt a commission in term ${career.term}.`]);
    setStep('SKILL');
  }

  function promoted() {
    let rank = career.rank+1;
    updateCareer({rank: rank});
    setStep('SKILL');
  }

  function notPromoted() {
    updateLog([`Sorry, you failed to get a promotion in term ${career.term}.`]);
    setStep('SKILL');
  }

  function promotionNotAttempted() {
    updateLog([`You did not attempt a promotion in term ${career.term}.`]);
    setStep('SKILL');
  }

  function choseSkill() {
    setStep('AGE');
  }

  function aged() {
    setAge(age+4);
    setStep('REENLIST');
  }

  function reenlist() {
    updateLog([`You have successfully reenlisted in the ${capitalize(career.branch)} for another term.`]);

    if (game === 'classic') {
      updateCareer({ rankPrev: career.rank }); // Reset rankPrev to the rank at the end of the term
    }

    setStep('SURVIVAL');
  }

  function ejected() {
    updateLog([`Unfortunately, you are not eligible for reenlistment with the ${capitalize(career.branch)}.`]);
    setStep('MUSTER-OUT');
  }

  function retired() {
    setStep('MUSTER-OUT');
  }

  function musterOut() {
    setStep('FINISHED');
  }

  function died() {
    updateLog([`You have died.`]);
    setStep('END');
  }

  function goodbye() {
    setStep('END');
  }

  return (
    <div id="App" className="App">
      <Game 
        name={name} 
        setName={setName} 
        game={game} 
        setGame={setGame} 
        display={step==='GAME'}
        onFinished={finishGameOptions}
        options={options}
        updateOptions={updateGameOptions}
      />
      <Character 
        game={game}
        name={name}
        career={career}
        upp={upp}
        skills={skills}
        age={age}
        credits={credits}
        items={items}
        display={step!=='GAME'}
      />
      <UPP 
        options={options} 
        updateOptions={updateGameOptions} 
        characteristics={upp} 
        updateUPP={updateUPP} 
        display={step==='UPP'}
        onFinalized={finalizeUPP}
      />
      <Career 
        game={game} 
        career={career} 
        upp={upp}
        updateUPP={updateUPP}
        skills={skills}
        updateSkills={updateSkills}
        display={step==='CAREER'}
        onEnlistment={enlisted}
        onDraft={drafted}
        updateLog={updateLog}
      />
      <Survival
        game={game}
        upp={upp}
        career={career}
        display={step==='SURVIVAL'}
        onSurvival={survived}
        onDeath={died}
      />
      <Commission
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        updateCareer={updateCareer}
        skills={skills}
        updateSkills={updateSkills}
        display={step==='COMMISSION'}
        onSuccess={commissioned}
        onFailure={commissionFailed}
        onNoAttempt={commissionNotAttempted}
        updateLog={updateLog}
      />
      <Promotion
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        updateCareer={updateCareer}
        skills={skills}
        updateSkills={updateSkills}
        display={step==='PROMOTION'}
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
        display={step==='SKILL'}
        onSelected={choseSkill}
        updateLog={updateLog}
      />
      <Age
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        age={age}
        display={step==='AGE'}
        onAged={aged}
        onDeath={died}
        updateLog={updateLog}
      />
      <Reenlist
        game={game}
        career={career}
        display={step==='REENLIST'}
        onSuccess={reenlist}
        onFailure={ejected}
        onRetirement={retired}
        updateLog={updateLog}
      />
      <MusterOut
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        skills={skills}
        updateSkills={updateSkills}
        credits={credits}
        updateCredits={setCredits}
        items={items}
        updateItems={updateItems}
        display={step==='MUSTER-OUT'}
        onMusterOut={musterOut}
        updateLog={updateLog}
      />
      <Goodbye
        updateLog={updateLog}
        display={step==='FINISHED'}
        onGoodbye={goodbye}
      />
      <Log log={log} />
      {/* <Homeworld name={homeworldName} updateName={setHomeworldName} upp={homeworldUPP} updateUPP={setHomeworldUPP} /> */}
    </div>
    
  );
}

function Goodbye({display, updateLog, onGoodbye}) {
  if (display) {
    updateLog(['Happy Travels!']);
    onGoodbye();
  }
  return (
    <div className="blank" />
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

// function generateUWP() {
//   return {
//     Starport: 8, 
//     Size: 8,
//     Atmosphere: 8,
//     Hydrographics: 8,
//     Population: 8,
//     Government: 8,
//     LawLevel: 8,
//     TechLevel: 8,
//   };
// }

export default App;
