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
import { NewCareer } from './NewCareer';

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
  'NEWCAREER',
  'FINISHED',
  'END'
];

function App() {
  let [step, setStep] = useState('GAME');
  let [nextStep, setNextStep] = useState(null);
  // let [game, setGame] = useState("classic");
  let [game, setGame] = useState("cepheusengine");
  let [options, setOptions] = useState({ rearrangeCharacteristics: false, });
  let [name, setName] = useState('');
  let [upp, setUPP] = useState(generateUPP());
  // let [homeworldName, setHomeworldName] = useState('');
  let [homeworldUWP, setHomeworldUWP] = useState(generateUWP());
  let [homeworldTradeCodes, setHomeworldTradeCodes] = useState([]);
  let [skills, setSkills] = useState({});
  let [numSkillRolls, setNumSkillRolls] = useState(0);
  let [cascadeSkill, setCascadeSkill] = useState(null);
  let [career, setCareer] = useState([]);
  let [mishap, setMishap] = useState('NONE');
  let [injury, setInjury] = useState({ roll: 0, crisis: false, injuries: {} });
  let [age, setAge] = useState(18);
  let [crisis, setCrisis] = useState(false);
  let [anagathics, setAnagathics] = useState({ current: false, terms: 0 });
  let [credits, setCredits] = useState(0);
  // let [credits, setCredits] = useState(100000);
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

  function updateNumSkillRolls(updated) {
    // console.log(`Updating # Skill Rolls to: ${updated}`);
    setNumSkillRolls(updated);
  }

  function updateCascadeSkill(updated) {
    setCascadeSkill(updated);
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

  function modifyItems(updated) {
    setItems(updated);
  }

  function updateLog(newEntries) {
    const newLog = log.concat(newEntries);
    setLog(newLog);
  }

  // =========================
  // Step Transition Functions
  // =========================

  // OPTION -> UPP
  function finishGameOptions(game, name) {
    updateLog([`You have selected ${game}.`, `Your name is ${name}.`]);
    setStep('UPP');
  }

  // UPP -> HOMEWORLD | CAREER
  function finalizeUPP() {
    let uppStr = Object.entries(upp).map(ent => num2tetra(ent[1])).join('');
    updateLog([`Your Universal Personality Profile is ${uppStr}.`]);

    if (game === 'cepheusengine') {
      setStep('HOMEWORLD');
    } else {
      setStep('CAREER');
    }
  }

  // HOMEWORLD -> BACKGROUND
  function finalizeHomeworld() {
    setStep('BACKGROUND');
  }

  // BACKGROUND -> CAREER
  function selectBackgroundSkills() {
    setStep('CAREER');
  }

  // CAREER -> SUVIVAL | DRAFT | ENTRYSKILLS | CASCADESKILL
  function enlisted(success, cascade) {
    if (game === 'classic') {
      if (!cascade) {
        setStep(success ? 'SURVIVAL' : 'DRAFT');
      } else {
        setStep('CASCADESKILL');
        setNextStep(success ? 'SURIVAL' : 'DRAFT');
      }
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

  // DRAFT -> SURVIVAL | ENTRYSKILLS | CASCADESKILL
  function drafted(cascade) {
    if (game === 'classic') {
      if (!cascade) {
        setStep('SURVIVAL');
      } else {
        setStep('CASCADESKILL');
        setNextStep('SURVIVAL');
      }
    } else if (game === 'cepheusengine') {
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

  // ENTRYSKILLS -> ANAGATHICS
  function entrySkillSelection() {
    if (game === 'cepheusengine') {
      setStep('ANAGATHICS');
    } else {
      setStep('END'); // Not implemented
    }
  }

  // ANAGATHICS -> SUVIVAL
  function anagathicsDecision() {
    if (game === 'cepheusengine') {
      setStep('SURVIVAL');
    } else {
      setStep('END'); // Not implemented
    }
  }

  // SURVIVAL -> COMMISSION | PROMOTION | SKILL
  function survived() {
    if (game === 'classic') {
      const curCareer = career[career.length - 1]; // Get latest career
      const careerData = CTCAREERS.filter(c => curCareer.branch === c.name)[0];

      // Set number of skill rolls each traveller gets.
      // First term travellers get two skill rolls. Higher term travellers get either 1 or 2 skill rolls depending on their career.
      updateNumSkillRolls(curCareer.term === 1 ? 2 : careerData.numSkillsPerTerm);

      // If the career does not have commissions or advancements, go to skill rolls.
      // Also skip commission & promotion if the traveller was drafted and its their first term.
      // Furthermore, skip commission & promotion if the traveller has reached the maximum rank in their career.
      if (careerData.commission === null || (curCareer.drafted === true && curCareer.term === 1) || (curCareer.rank === careerData.ranks.length-1)) {
        setStep('SKILL');
      } else if (curCareer.rank >= 1 && curCareer.rank < careerData.ranks.length - 1) { // Go directly to promotion if a commission has already been earned
        setStep('PROMOTION');                                                           // and the traveller has not yet achieved the maximum rank.
      } else {
        setStep('COMMISSION');
      }
    } else if (game === 'cepheusengine') {
      const curCareer = career[career.length - 1]; // Get latest career
      const careerData = CECAREERS.filter(c => curCareer.branch === c.name)[0];

      // Set number of skill rolls each traveller gets.
      // First term travellers get two skill rolls. Higher term travellers get either 1 or 2 skill rolls depending on their career.
      updateNumSkillRolls(curCareer.term === 1 ? 2 : careerData.numSkillsPerTerm);

      // If the career does not have commissions or advancements, go to skill rolls.
      // Also skip commission & promotion if the traveller was drafted and its their first term.
      // Furthermore, skip commission & promotion if the traveller has reached the maximum rank in their career.
      if (careerData.commission === null || (curCareer.drafted === true && curCareer.term === 1) || (curCareer.rank === careerData.ranks.length-1)) {
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

  // SURVIVAL -> MISHAP
  function mishapHappened() {
    setStep('MISHAP');
  }

  // MISHAP -> AGE | INJURY
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

  // INJURY -> MEDICAL
  function injuryResolved() {
    setStep('MEDICAL');
  }

  // MEDICAL -> AGE
  function medicalResolved() {
    setStep('AGE');
  }

  // COMMISSION -> PROMOTION | SKILL | CASCADESKILL
  function commissioned(success, cascade) {
    // Increment number of skill rolls
    if (success) {
      updateNumSkillRolls(numSkillRolls+1);
    }

    if (cascade) {
      setStep('CASCADESKILL');
      setNextStep(success ? 'PROMOTION' : 'SKILL');
    } else {
      setStep(success ? 'PROMOTION' : 'SKILL');
    }
  }

  // PROMOTION -> SKILL | CASCADESKILL
  function promoted(success, cascade) {
    // Increment number of skill rolls
    if (success) {
      updateNumSkillRolls(numSkillRolls+1);
    }

    if (cascade) {
      setStep('CASCADESKILL');
      setNextStep('SKILL');
    } else {
      setStep('SKILL');
    }
  }

  // SKILL -> AGE | CASCADESKILL
  function choseSkill(cascade) {
    const curNumSkillRolls = numSkillRolls-1;
    updateNumSkillRolls(curNumSkillRolls);

    if (cascade) {
      setStep('CASCADESKILL');
      setNextStep(curNumSkillRolls > 0 ? 'SKILL' : 'AGE');
    } else {
      setStep(curNumSkillRolls > 0 ? 'SKILL' : 'AGE')
    }
  }

  // CASCADE SKILL -> ENTRYSKILLS | SURVIVAL | PROMOTION | SKILL | AGE
  function choseCascadeSkill() {
    setStep(nextStep);
    setNextStep(null);
  }

  // AGE -> REENLIST | MUSTER-OUT
  function aged() {
    if (game === 'cepheusengine') {
      switch(mishap) {
        case 'MEDICAL-DISCHARGE':
        case 'HONORABLE-DISCHARGE':
          setStep('MUSTER-OUT');
          break;
        case 'DISHONORABLE-DISCHARGE':
        case 'PRISON':
          setStep('NEWCAREER'); // Lose all benefits rolls from current career
          break;
        default:
          setStep('REENLIST');
          break;
      }
    } else {
      setStep('REENLIST');
    }
  }

  // REENLIST -> SURVIVAL | ANAGATHICS
  function reenlist() {
    if (game === 'classic') {
      setStep('SURVIVAL');
    } else {
      setStep('ANAGATHICS');
    }
  }

  // REENLIST -> MUSTER-OUT
  function ejected() {
    setStep('MUSTER-OUT');
  }

  // REENLIST -> MUSTER-OUT
  function retired() {
    setStep('MUSTER-OUT');
  }

  // MUSTER-OUT -> NEWCAREER | FINISHED
  function musterOut() {
    setStep('FINISHED');
  }

  // NEWCAREER -> CAREER | ENTRYSKILLS | FINISHED
  function newCareer(tryNewCareer, drifter) {
    if (tryNewCareer) {
      setStep(drifter ? 'ENTRYSKILLS' : 'CAREER');
    } else {
      setStep('FINISHED');
    }
  }

  // SURVIVAL | INJURY | AGE -> END
  function died() {
    updateLog([`You have died.`]);
    setStep('END');
  }

  // FINISHED -> END
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
        updateCascadeSkill={updateCascadeSkill}
        display={step === 'CAREER'}
        onEnlistment={enlisted}
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
        updateCascadeSkill={updateCascadeSkill}
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
        updateLog={updateLog}
      />
      <Injury
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        injury={injury}
        updateInjury={updateInjury}
        updateCrisis={setCrisis}
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
        updateCascadeSkill={updateCascadeSkill}
        display={step === 'COMMISSION'}
        onSuccess={commissioned}
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
        updateCascadeSkill={updateCascadeSkill}
        display={step === 'PROMOTION'}
        onSuccess={promoted}
        updateLog={updateLog}
      />
      <Skill
        game={game}
        upp={upp}
        updateUPP={updateUPP}
        career={career}
        skills={skills}
        updateSkills={updateSkills}
        cascadeSkill={cascadeSkill}
        updateCascadeSkill={updateCascadeSkill}
        numSkillRolls={numSkillRolls}
        display={step === 'SKILL'}
        onSelected={choseSkill}
        updateLog={updateLog}
      />
      <CascadeSkill
        game={game}
        skills={skills}
        updateSkills={updateSkills}
        cascadeSkill={cascadeSkill}
        updateCascadeSkill={updateCascadeSkill}
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
        career={career}
        anagathics={anagathics}
        mishap={mishap}
        updateCrisis={setCrisis}
        credits={credits}
        updateCredits={updateCredits}
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
        modifyItems={modifyItems}
        display={step === 'MUSTER-OUT'}
        onMusterOut={musterOut}
        updateLog={updateLog}
      />
      <NewCareer
        game={game}
        career={career}
        updateCareer={updateCareer}
        crisis={crisis}
        display={step === 'NEWCAREER'}
        onSelection={newCareer}
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
