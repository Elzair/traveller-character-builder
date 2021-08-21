import React from 'react';
// import { useState } from 'react';
import { r1d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

// const INITIALNUMSKILLROLLS = 99; // Use some large number first.

export function Skill({ game, upp, updateUPP, career, skills, updateSkills, cascadeSkill, updateCascadeSkill, numSkillRolls, display, onSelected, updateLog }) {
    if (display && game === 'classic') {
        return (
            <SkillCT
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                numSkillRolls={numSkillRolls}
                onSelected={onSelected}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <SkillCE
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                numSkillRolls={numSkillRolls}
                onSelected={onSelected}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function SkillCT({ upp, updateUPP, career, skills, updateSkills, cascadeSkill, updateCascadeSkill, numSkillRolls, onSelected, updateLog }) {
    // let [numSkillRolls, setNumSkillRolls] = useState(INITIALNUMSKILLROLLS); 
    // let [cascade, setCascade] = useState(null);

    // function decreaseSkillRolls() {
    //     const curNumSkillRolls = numSkillRolls - 1;
    //     setNumSkillRolls(curNumSkillRolls);
    //     if (curNumSkillRolls === 0) { // React takes a while to update state, so we compare with `curNumSkillRolls` rather than `numSkillRolls`.
    //         setNumSkillRolls(INITIALNUMSKILLROLLS);
    //         onSelected();
    //     }
    // }

    function handleSkillSelection(ev) {
        ev.preventDefault();

        let tbl = '';
        for (let t of ev.target) {
            if (t.checked) {
                tbl = t.value;
            }
        }

        if (tbl !== '') {
            let newLog = [];
            let tmpCascade = null;
            const curCareer = career[career.length - 1]; // Get latest career

            // Give travellers of rank 5 or 6 a +1 DM on skill table.
            const skillDM = curCareer.rank >= 5 ? 1 : 0;

            // Pick a random skill from the skill table.
            const careerData = CTCAREERS.filter(c => c.name === curCareer.branch)[0];
            const table = careerData[tbl];
            const advance = table[Math.min(r1d6() - 1 + skillDM, 5)];

            if (advance.type === 'CHARACTERISTIC') {
                let newChar = {};
                newChar[advance.name] = upp[advance.name] + advance.value;
                updateUPP(newChar);

                newLog.push(`You have increased your ${advance.name} to ${newChar[advance.name]}.`);
                // decreaseSkillRolls();
            } else if (advance.type === 'SKILL') {
                const skillData = CTSKILLS[advance.name];
                if (skillData === null) { // A non-cascade skill
                    let newSkill = {};
                    if (!skills.hasOwnProperty(advance.name)) {
                        newSkill[advance.name] = advance.value;
                    } else {
                        newSkill[advance.name] = skills[advance.name] + advance.value;
                    }
                    updateSkills(newSkill);

                    newLog.push(`You improved your ${advance.name} to ${newSkill[advance.name]}.`);
                    // decreaseSkillRolls();
                } else {
                    // setCascade(adv);
                    tmpCascade = advance;
                }
            }

            updateLog(newLog);

            if (tmpCascade) {
                updateCascadeSkill(tmpCascade);
            }

            onSelected(tmpCascade ? true : false);
        }
    }

    // function handleCascadeSkillSelection(ev) {
    //     ev.preventDefault();

    //     let skill = '';
    //     for (let t of ev.target) {
    //         if (t.checked) {
    //             skill = t.value;
    //         }
    //     }

    //     if (skill !== '') {
    //         let newSkill = {};
    //         if (!skills.hasOwnProperty(skill)) {
    //             newSkill[skill] = cascade.value;
    //         } else {
    //             newSkill[skill] = skills[skill] + cascade.value;
    //         }
    //         updateSkills(newSkill);
    //         updateLog([`You improved your ${skill} to ${newSkill[skill]}.`]);

    //         setCascade(null); // Reset cascade skills.
    //         decreaseSkillRolls();
    //     }
    // }

    // // Set the number of skill rolls for this term.
    // // If it is the traveller's first term, give them 2 skill rolls.
    // // Otherwise, default to the number of skill rolls give by the career.
    // // For each rank the traveller has advanced, give them an extra skill roll.
    // if (numSkillRolls === INITIALNUMSKILLROLLS) {
    //     const curCareer = career[career.length-1]; // Get latest career
    //     const careerData = CTCAREERS.filter(c => curCareer.branch === c.name)[0];
    //     const numRolls = (curCareer.term === 1 ? 2 : careerData.numSkillsPerTerm) + (curCareer.rank - curCareer.rankPrev);
    //     setNumSkillRolls(numRolls);
    // }

    // if (!cascade) {
    let options = {
        "pdt": "Personal Development",
        "sst": "Service Skills",
        "aet1": "Advanced Education",
    };
    if (upp.Education >= 8) { // Travellers with high education get to choose from another table of skills.
        options['aet2'] = "Advanced Education 2";
    }
    const optionElts = Object.keys(options).map(prop => (
        <label>
            <input type="radio" id={prop} name="skilltable" value={prop} />
            {options[prop]}
        </label>
    ));

    return (
        <div>
            <p>You have {numSkillRolls} skill rolls remaining.</p>
            {<form onSubmit={handleSkillSelection}>
                <label>Choose an area to improve:</label>
                {optionElts}
                <input type="submit" value="Submit" />
            </form>}
        </div>
    );
    // } else {
    //     const skillData = CTSKILLS[cascade.name];
    //     const optionElts = Object.keys(skillData).map(skill => (
    //         <label>
    //             <input type="radio" id={skill} name="cascadeskill" value={skill} />
    //             {skill}
    //         </label>
    //     ));

    //     return (
    //         <div>
    //             {<form onSubmit={handleCascadeSkillSelection}>
    //                 <label>{`Choose a specific focus of ${cascade.name}:`}</label>
    //                 {optionElts}
    //                 <input type="submit" value="Submit" />
    //             </form>}
    //         </div>
    //     );
    // }
}

function SkillCE({ upp, updateUPP, career, skills, updateSkills, cascadeSkill, updateCascadeSkill, numSkillRolls, onSelected, updateLog }) {
    function handleSkillSelection(ev) {
        ev.preventDefault();

        let tbl = '';
        for (let t of ev.target) {
            if (t.checked) {
                tbl = t.value;
            }
        }

        if (tbl !== '') {
            let newLog = [];
            let tmpCascade = null;
            const curCareer = career[career.length - 1]; // Get latest career

            // Pick a random skill from the skill table.
            const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];
            const table = careerData[tbl];
            const advance = table[r1d6() - 1];

            if (advance.type === 'CHARACTERISTIC') {
                let newChar = {};
                newChar[advance.name] = upp[advance.name] + advance.value;
                updateUPP(newChar);

                newLog.push(`You have increased your ${advance.name} to ${newChar[advance.name]}.`);
                // decreaseSkillRolls();
            } else if (advance.type === 'SKILL') {
                const skillData = CESKILLS[advance.name];

                if (skillData === null) { // A non-cascade skill
                    let newSkill = {};
                    if (!skills.hasOwnProperty(advance.name)) {
                        newSkill[advance.name] = advance.value;
                    } else {
                        newSkill[advance.name] = skills[advance.name] + advance.value;
                    }
                    updateSkills(newSkill);

                    newLog.push(`You improved your ${advance.name} to ${newSkill[advance.name]}.`);
                    // decreaseSkillRolls();
                } else {
                    // setCascade(adv);
                    tmpCascade = advance;
                }
            }

            updateLog(newLog);

            if (tmpCascade) {
                updateCascadeSkill(tmpCascade);
            }

            onSelected(tmpCascade ? true : false);
        }
    }
    let options = {
        "pdt": "Personal Development",
        "sst": "Service Skills",
        "spst": "Specialist Skills",
    };
    if (upp.Education >= 8) { // Travellers with high education get to choose from another table of skills.
        options['aet'] = "Advanced Education";
    }
    const optionElts = Object.keys(options).map(prop => (
        <label>
            <input type="radio" id={prop} name="skilltable" value={prop} />
            {options[prop]}
        </label>
    ));

    return (
        <div>
            <p>You have {numSkillRolls} skill rolls remaining.</p>
            {<form onSubmit={handleSkillSelection}>
                <label>Choose an area to improve:</label>
                {optionElts}
                <input type="submit" value="Submit" />
            </form>}
        </div>
    );

}
