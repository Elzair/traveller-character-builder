import React from 'react';
import { useState } from 'react';
import { r1d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';

export function Skill({ game, upp, updateUPP, career, skills, updateSkills, display, onSelected, updateLog }) {
    if (display && game === 'classic') {
        return (
            <SkillCT
                game={game}
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                skills={skills}
                updateSkills={updateSkills}
                onSelected={onSelected}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function SkillCT({ game, upp, updateUPP, career, skills, updateSkills, display, onSelected, updateLog }) {
    let [numSkillRolls, setNumSkillRolls] = useState(99); // Use some large number first.
    let [cascade, setCascade] = useState(null);

    function decreaseSkillRolls() {
        const curNumSkillRolls = numSkillRolls;
        setNumSkillRolls(numSkillRolls - 1);
        if (curNumSkillRolls === 1) { // React takes a while to update state, so we compare with 1 rather than 0
            onSelected();
        }
    }

    function handleSkillSelection(ev) {
        ev.preventDefault();

        let tbl = '';
        for (let t of ev.target) {
            if (t.checked) {
                tbl = t.value;
            }
        }
        // console.log(tbl);

        if (tbl !== '') {
            const curCareer = career[career.length-1]; // Get latest career
            
            // Give travellers of rank 5 or 6 a +1 DM on skill table.
            const skillDM = curCareer.rank >= 5 ? 1 : 0;
            
            // Pick a random skill from the skill table.
            const careerData = CTCAREERS.filter(c => c.name === curCareer.branch)[0];
            const table = careerData[tbl];
            const adv = table[Math.min(r1d6() - 1 + skillDM, 5)];
            // console.log(adv);

            if (adv.type === 'CHARACTERISTIC') {
                let newChar = {};
                newChar[adv.name] = upp[adv.name] + adv.value;
                updateUPP(newChar);
                updateLog([`You have increased your ${adv.name} to ${newChar[adv.name]}.`]);
                decreaseSkillRolls();
            } else if (adv.type === 'SKILL') {
                const skillData = CTSKILLS[adv.name];
                if (skillData === null) { // A non-cascade skill
                    let newSkill = {};
                    if (!skills.hasOwnProperty(adv.name)) {
                        newSkill[adv.name] = adv.value;
                    } else {
                        newSkill[adv.name] = skills[adv.name] + adv.value;
                    }
                    updateLog([`You improved your ${adv.name} to ${newSkill[adv.name]}.`]);
                    updateSkills(newSkill);
                    decreaseSkillRolls();
                } else {
                    setCascade(adv);
                }
            }
        }
    }

    function handleCascadeSkillSelection(ev) {
        ev.preventDefault();

        let skill = '';
        for (let t of ev.target) {
            if (t.checked) {
                skill = t.value;
            }
        }

        if (skill !== '') {
            let newSkill = {};
            if (!skills.hasOwnProperty(skill)) {
                newSkill[skill] = cascade.value;
            } else {
                newSkill[skill] = skills[skill] + cascade.value;
            }
            setCascade(null); // Reset cascade skills.
            decreaseSkillRolls();
            updateSkills(newSkill);
            updateLog([`You improved your ${skill} to ${newSkill[skill]}.`]);
        }
    }

    // Set the number of skill rolls for this term.
    // If it is the traveller's first term, give them 2 skill rolls.
    // Otherwise, default to the number of skill rolls give by the career.
    // For each rank the traveller has advanced, give them an extra skill roll.
    if (numSkillRolls === 99) {
        const curCareer = career[career.length-1]; // Get latest career
        const careerData = CTCAREERS.filter(c => curCareer.branch === c.name)[0];
        const numRolls = (curCareer.term === 1 ? 2 : careerData.numSkillsPerTerm) + (curCareer.rank - curCareer.rankPrev);
        setNumSkillRolls(numRolls);
    }

    if (!cascade) {
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
                {<form onSubmit={handleSkillSelection}>
                    <label>Choose an area to improve:</label>
                    {optionElts}
                    <input type="submit" value="Submit" />
                </form>}
            </div>
        );
    } else {
        const skillData = CTSKILLS[cascade.name];
        const optionElts = Object.keys(skillData).map(skill => (
            <label>
                <input type="radio" id={skill} name="cascadeskill" value={skill} />
                {skill}
            </label>
        ));

        return (
            <div>
                {<form onSubmit={handleCascadeSkillSelection}>
                    <label>{`Choose a specific focus of ${cascade.name}:`}</label>
                    {optionElts}
                    <input type="submit" value="Submit" />
                </form>}
            </div>
        );
    }
}