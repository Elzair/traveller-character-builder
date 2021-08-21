import React, { useEffect } from 'react';
import { useState } from 'react';
// import logo from './logo.svg';

import './App.css';

import { num2tetra, r2d6, updateObject } from './utils';

import { Game } from './Game';
import { UPP } from './UPP';
import { Homeworld } from './Homeworld';
import { Background } from './Background';
import { Career } from './Career';
import { Draft } from './Draft';
import { EntrySkill } from './EntrySkill';
import { Anagathics } from './Anagathics';
import { Survival } from './Survival';
import { Mishap } from './Mishap';
import { Injury } from './Injury';
import { Medical } from './Medical';
import { Commission } from './Commission';
import { Promotion } from './Promotion';
import { Skill } from './Skill';
import { CascadeSkill } from './CascadeSkill';
import { Character } from './Character';
import { Age } from './Age';
import { Reenlist } from './Reenlist';
import { MusterOut } from './MusterOut';
import { Log } from './Log';

import CTCAREERS from './data/ct/careers';
import CECAREERS from './data/ce/careers';

// eslint-disable-next-line
const STEPS = [
  'GAME',
  'UPP',
  'HOMEWORLD',
  'BACKGROUND',
  'CAREER',
  'DRAFT',
  'ENTRYSKILLS',
  'ANAGATHICS',
  'SURVIVAL',
  'MISHAP',
  'INJURY',
  'MEDICAL',
  'COMMISSION',
  'PROMOTION',
  'SKILL',
  'CASCADESKILL',
  'AGE',
  'REENLISTMENT',
  'MUSTER-OUT',
  'FINISHED',
  'END'
];

function App() {
  let [step, setStep] = useState('GAME');
  let [nextStep, setNextStep] = useState(null);
  let [game, setGame] = useState("classic");
  let [options, setOptions] = useState({ rearrangeCharacteristics: false, });
  let [name, setName] = useState('');
  let [upp, setUPP] = useState(generateUPP());
  // let [homeworldName, setHomeworldName] = useState('');
  let [homeworldUWP, setHomeworldUWP] = useState(generateUWP());
  let [homeworldTradeCodes, setHomeworldTradeCodes] = useState([]);
  let [skills, setSkills] = useState({});
  let [cascadeSkill, setCascadeSkill] = useState(null);
  let [career, setCareer] = useState([]);
  let [mishap, setMishap] = useState('NONE');
  let [injury, setInjury] = useState({ roll: 0, crisis: false, injuries: {} });
  let [age, setAge] = useState(18);
  let [anagathics, setAnagathics] = useState({ current: false, terms: 0 });
  // let [credits, setCredits] = useState(0);
  let [credits, setCredits] = useState(100000);
  let [items, setItems] = useState({});
  let [log, setLog] = useState([]);

  // Update State Functions
  function updateGameOptions(opts) {
    setOptions(updateObject(options, opts));
  }

  function updateUPP(updated) {
    setUPP(updateObject(upp, updated));
  }

  function updateHomeworldUWP(updated) {
    setHomeworldUWP(updateObject(homeworldUWP, updated));
  }

  function updateCareer(updated) {
    setCareer(updated);
  }

  function updateSkills(updated) {
    setSkills(updateObject(skills, updated));
  }

  function updateAnagathics(taking) {
    if (taking) {
      setAnagathics({
        current: true,
        terms: anagathics.terms + 1
      });
    } else {
      setAnagathics({
        current: false,
        terms: anagathics.terms
      });
    }
  }

  function updateMishap(newMishap) {
    setMishap(newMishap);
  }

  function updateInjury(newInjury) {
    setInjury(newInjury);
  }

  function updateCredits(newCredits) {
    setCredits(credits + newCredits);
  }

  function updateItems(updated) {
    let newItems = { ...items };

    Object.entries(updated).forEach(([name, val]) => {
      newItems[name] = newItems.hasOwnProperty(name) ? newItems[name] + val : val;
    });

    setItems(newItems);
  }

  function updateLog(newEntries) {
    const newLog = log.concat(newEntries);
    setLog(newLog);
  }

  // Step Transition Functions
  function finishGameOptions(game, name) {
    updateLog([`You have selected ${game}.`, `Your name is ${name}.`]);
    setStep('UPP');
  }

  function finalizeUPP() {
    let uppStr = Object.entries(upp).map(ent => num2tetra(ent[1])).join('');
    updateLog([`Your Universal Personality Profile is ${uppStr}.`]);

    if (game === 'cepheusengine') {
      setStep('HOMEWORLD');
    } else {
      setStep('CAREER');
    }
  }

  function finalizeHomeworld() {
    setStep('BACKGROUND');
  }

  function selectBackgroundSkills() {
    setStep('CAREER');
  }

  function enlisted(success, cascade) {
    if (game === 'classic') {
      setStep('SURVIVAL');
    } else if (game === 'cepheusengine') {
      if (!cascade) {
        setStep(success ? 'ENTRYSKILLS' : 'DRAFT');
      } else {
        setStep('CASCADESKILL');
        setNextStep(success ? 'ENTRYSKILLS' : 'DRAFT');
      }
    } else {
      setStep('END'); // Not implemented
    }
  }

  function drafted(cascade) {
    if (game === 'classic') {
      setStep('SURVIVAL');
    } else if (game === 'cepheusengine') {
      // setStep('ENTRYSKILLS');
      if (!cascade) {
        setStep('ENTRYSKILLS');
      } else {
        setStep('CASCADESKILL');
        setNextStep('ENTRYSKILLS');
      }
    } else {
      setStep('END'); // Not implemented
    }
  }

  function entrySkillSelection() {
    if (game === 'cepheusengine') {
      setStep('ANAGATHICS');
    } else {
      setStep('END'); // Not implemented
    }
  }

  function anagathicsDecision() {
    console.log('Got here');
    if (game === 'cepheusengine') {
      console.log('Got here too');
      setStep('SURVIVAL');
    } else {
      setStep('END'); // Not implemented
    }
  }

  function survived() {
    if (game === 'classic') {
      const curCareer = career[career.length - 1]; // Get latest career
      const careerData = CTCAREERS.filter(c => curCareer.branch === c.name)[0];

      // If the career does not have commissions or advancements, go to skill rolls.
      // Also skip commission & promotion if the traveller was drafted and its their first term.
      if (careerData.commission === null || (curCareer.drafted === true && curCareer.term === 1)) {
        setStep('SKILL');
      } else if (curCareer.rank >= 1 && curCareer.rank < careerData.ranks.length - 1) { // Go directly to promotion if a commission has already been earned
        setStep('PROMOTION');                                                           // and the traveller has not yet achieved the maximum rank.
      } else {
        setStep('COMMISSION');
      }
    } else if (game === 'cepheusengine') {
      const curCareer = career[career.length - 1]; // Get latest career
      const careerData = CECAREERS.filter(c => curCareer.branch === c.name)[0];

      // If the career does not have commissions or advancements, go to skill rolls.
      // Also skip commission & promotion if the traveller was drafted and its their first term.
      if (careerData.commission === null || (curCareer.drafted === true && curCareer.term === 1)) {
        setStep('SKILL');
      } else if (curCareer.rank >= 1 && curCareer.rank < careerData.ranks.length - 1) { // Go directly to promotion if a commission has already been earned
        setStep('PROMOTION');                                                           // and the traveller has not yet achieved the maximum rank.
      } else {
        setStep('COMMISSION');
      }
    } else {
      setStep('NOT-IMPLEMENTED');
    }
  }

  function mishapHappened() {
    setStep('MISHAP');
  }

  function mishapResolved(newMishap) {
    if (game === 'cepheusengine') {
      switch (newMishap) {
        case 'HONORABLE-DISCHARGE':
        case 'DISHONORABLE-DISCHARGE':
        case 'PRISON':
          setStep('AGE');
          break;
        case 'MEDICAL-DISCHARGE':
          setStep('INJURY');
          break;
        default:
          throw new Error('mishapResolved: Invalid mishap type!');
      }
    } else {
      setStep('END'); // Not implemented yet
    }
  }

  function injuryResolved() {
    setStep('MEDICAL');
  }

  function medicalResolved() {
    setStep('AGE');
  }

  function commissioned(cascade) {
    if (cascade) {
      setStep('CASCADESKILL');
      setNextStep('PROMOTION');
    } else {
      setStep('PROMOTION');
    }
  }

  function commissionFailed() {
    setStep('SKILL');
  }

  function commissionNotAttempted() {
    setStep('SKILL');
  }

  function promoted(cascade) {
    if (cascade) {
      setStep('CASCADESKILL');
      setNextStep('SKILL');
    } else {
      setStep('SKILL');
    }
  }

  function notPromoted() {
    setStep('SKILL');
  }

  function promotionNotAttempted() {
    setStep('SKILL');
  }

  function choseSkill() {
    setStep('AGE');
  }

  function choseCascadeSkill() {
    setStep(nextStep);
    setNextStep(null);
  }

  function aged() {
    // setAge(age+4);
    setStep('REENLIST');
  }

  function reenlist() {
    setStep('SURVIVAL');
  }

  function ejected() {
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
        display={step === 'GAME'}
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
        display={step !== 'GAME'}
      />
      <UPP
        options={options}
        updateOptions={updateGameOptions}
        characteristics={upp}
        updateUPP={updateUPP}
        display={step === 'UPP'}
        onFinalized={finalizeUPP}
      />
      <Homeworld
        uwp={homeworldUWP}
        updateUWP={updateHomeworldUWP}
        tradeCodes={homeworldTradeCodes}
        updateTradeCodes={setHomeworldTradeCodes}
        display={step === 'HOMEWORLD'}
        onFinalized={finalizeHomeworld}
      />
      <Background
        game={game}
        upp={upp}
        homeworldUWP={homeworldUWP}
        homeworldTradeCodes={homeworldTradeCodes}
        skills={skills}
        updateSkills={updateSkills}
        display={step === 'BACKGROUND'}
        onFinalized={selectBackgroundSkills}
        updateLog={updateLog}
      />
      <Career
        game={game}
        career={career}
        updateCareer={updateCareer}
        upp={upp}
        updateUPP={updateUPP}
        skills={skills}
        updateSkills={updateSkills}
        cascadeSkill={cascadeSkill}
        updateCascadeSkill={setCascadeSkill}
        display={step === 'CAREER'}
        onEnlistment={enlisted}
        // onDraft={drafted}
        updateLog={updateLog}
      />
      <Draft
        game={game}
        career={career}
        updateCareer={updateCareer}
        upp={upp}
        updateUPP={updateUPP}
        skills={skills}
        updateSkills={updateSkills}
        cascadeSkill={cascadeSkill}
        updateCascadeSkill={setCascadeSkill}
        display={step === 'DRAFT'}
        onDraft={drafted}
        updateLog={updateLog}
      />
      <EntrySkill
        game={game}
        career={career}
        upp={upp}
        updateUPP={updateUPP}
        skills={skills}
        updateSkills={updateSkills}
        display={step === 'ENTRYSKILLS'}
        onSkillSelection={entrySkillSelection}
        updateLog={updateLog}
      />
      <Anagathics
        game={game}
        anagathics={anagathics}
        updateAnagathics={updateAnagathics}
        updateCredits={updateCredits}
        display={step === 'ANAGATHICS'}
        onAnagathicsDecision={anagathicsDecision}
        updateLog={updateLog}
      />
      <Survival
        game={game}
        options={options}
        upp={upp}
        career={career}
        updateCareer={updateCareer}
        anagathics={anagathics}
        display={step === 'SURVIVAL'}
        onSurvival={survived}
        onMishap={mishapHappened}
        onDeath={died}
        updateLog={updateLog}
      />
      <Mishap
        game={game}
        options={options}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        updateCareer={updateCareer}
        injury={injury}
        updateInjury={updateInjury}
        updateMishap={updateMishap}
        updateCredits={updateCredits}
        display={step === 'MISHAP'}
        onSurvival={survived}
        onMishap={mishapResolved}
        onDeath={died}
        updateLog={updateLog}
      />
      <Injury
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        injury={injury}
        updateInjury={updateInjury}
        credits={credits}
        updateCredits={updateCredits}
        display={step === 'INJURY'}
        onInjury={injuryResolved}
        onDeath={died}
        updateLog={updateLog}
      />
      <Medical
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        injury={injury}
        updateInjury={updateInjury}
        credits={credits}
        updateCredits={updateCredits}
        display={step === 'MEDICAL'}
        onMedical={medicalResolved}
        updateLog={updateLog}
      />
      <Commission
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        updateCareer={updateCareer}
        skills={skills}
        updateSkills={updateSkills}
        cascadeSkill={cascadeSkill}
        updateCascadeSkill={setCascadeSkill}
        display={step === 'COMMISSION'}
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
        cascadeSkill={cascadeSkill}
        updateCascadeSkill={setCascadeSkill}
        display={step === 'PROMOTION'}
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
        display={step === 'SKILL'}
        onSelected={choseSkill}
        updateLog={updateLog}
      />
      <CascadeSkill
        game={game}
        skills={skills}
        updateSkills={updateSkills}
        cascadeSkill={cascadeSkill}
        updateCascadeSkill={setCascadeSkill}
        display={step === 'CASCADESKILL'}
        onSelected={choseCascadeSkill}
        updateLog={updateLog}
      />
      <Age
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        age={age}
        updateAge={setAge}
        display={step === 'AGE'}
        onAged={aged}
        onDeath={died}
        updateLog={updateLog}
      />
      <Reenlist
        game={game}
        career={career}
        updateCareer={updateCareer}
        options={options}
        display={step === 'REENLIST'}
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
        updateCredits={updateCredits}
        items={items}
        updateItems={updateItems}
        display={step === 'MUSTER-OUT'}
        onMusterOut={musterOut}
        updateLog={updateLog}
      />
      <Goodbye
        updateLog={updateLog}
        display={step === 'FINISHED'}
        onGoodbye={goodbye}
      />
      <Log log={log} />
    </div>

  );
}

function Goodbye({ display, updateLog, onGoodbye }) {
  useEffect(() => {
    if (display) {
      updateLog(['Happy Travels!']);
      onGoodbye();
    }
  })
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
