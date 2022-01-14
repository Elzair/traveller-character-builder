// These components handle selecting a skill that the traveller improves during their current term.

import React from 'react';
// import { useState } from 'react';
import { r1d6 } from './random';

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

// Main Skill Component handles whether or not to display Skill (based on `display`)  
// and whether to use Classic Traveller, Cepheus Engine, or Mongoose Traveller 2nd Edition.
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

// ..######..##..........###.....######...######..####..######.
// .##....##.##.........##.##...##....##.##....##..##..##....##
// .##.......##........##...##..##.......##........##..##......
// .##.......##.......##.....##..######...######...##..##......
// .##.......##.......#########.......##.......##..##..##......
// .##....##.##.......##.....##.##....##.##....##..##..##....##
// ..######..########.##.....##..######...######..####..######.
function SkillCT({ upp, updateUPP, career, skills, updateSkills, cascadeSkill, updateCascadeSkill, numSkillRolls, onSelected, updateLog }) {
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
            } else if (advance.type === 'SKILL') {
                const skillData = CTSKILLS[advance.name];
                if (skillData === null || skillData === undefined) { // A non-cascade skill
                    let newSkills = {};
                    newSkills[advance.name] = (skills[advance.name] || 0) + advance.value;
                    updateSkills(newSkills);

                    newLog.push(`You improved your ${advance.name} to ${newSkills[advance.name]}.`);
                } else {
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
}

// ..######..########.########..##.....##.########.##.....##..######.
// .##....##.##.......##.....##.##.....##.##.......##.....##.##....##
// .##.......##.......##.....##.##.....##.##.......##.....##.##......
// .##.......######...########..#########.######...##.....##..######.
// .##.......##.......##........##.....##.##.......##.....##.......##
// .##....##.##.......##........##.....##.##.......##.....##.##....##
// ..######..########.##........##.....##.########..#######...######.
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
            } else if (advance.type === 'SKILL') {
                const skillData = CESKILLS[advance.name];

                if (skillData === null || skillData === undefined) { // A non-cascade skill
                    let newSkills = {};
                    newSkills[advance.name] = (skills[advance.name] || 0) + advance.value;
                    updateSkills(newSkills);

                    newLog.push(`You improved your ${advance.name} to ${newSkills[advance.name]}.`);
                } else {
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
