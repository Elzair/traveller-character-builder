// These components handle giving traveller's skills when they first enter a career.

import React, { useEffect } from 'react';

import { capitalize } from './utils';

import CECAREERS from './data/ce/careers.json';

// Main EntrySkill Component handles whether or not to display EntrySkill (based on `display`)  
// and whether to use Cepheus Engine or Mongoose Traveller 2nd Edition.
export function EntrySkill({ game, career, upp, skills, updateSkills, display, onSkillSelection, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <EntrySkillCE
                career={career}
                upp={upp}
                skills={skills}
                updateSkills={updateSkills}
                onSkillSelection={onSkillSelection}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>)
    }
}

// ..######..########.########..##.....##.########.##.....##..######.
// .##....##.##.......##.....##.##.....##.##.......##.....##.##....##
// .##.......##.......##.....##.##.....##.##.......##.....##.##......
// .##.......######...########..#########.######...##.....##..######.
// .##.......##.......##........##.....##.##.......##.....##.......##
// .##....##.##.......##........##.....##.##.......##.....##.##....##
// ..######..########.##........##.....##.########..#######...######.

function EntrySkillCE({ career, upp, skills, updateSkills, onSkillSelection, updateLog }) {
    function selectSkill(ev) {
        ev.preventDefault();

        let skillName = '';
        for (let s of ev.target) {
            if (s.checked) {
                skillName = s.value;
            }
        }

        updateSkills({ [skillName]: 0 });
        updateLog(`You gain ${skillName}-0.`);
        onSkillSelection();
    }

    // If this is the traveller's first career, give them all service skills at level 0.
    // Otherwise, let them select one skill from the career's service skill table to be level 0.
    useEffect(() => {
        if (career.length === 1) {
            const careerData = CECAREERS.filter(c => c.name === career[career.length - 1].branch)[0];
            const serviceSkills = careerData.sst.filter(skill => skill.type === 'SKILL').map(skill => skill.name);
            let newLog = [];

            let newSkills = {};
            serviceSkills.forEach(skill => {
                // Only give the traveller a skill they do not already have
                if (!skills.hasOwnProperty(skill)) {
                    newSkills[skill] = 0;
                    newLog.push(`You gain ${skill}-0.`);
                }
            });

            updateSkills(newSkills);
            updateLog(newLog);
            onSkillSelection();
        }
    });

    if (career.length === 1) {
        return (<div></div>);
    } else {
        // Allow traveller to learn a career's service skill at level 0 if they do not already know it.
        const careerData = CECAREERS.filter(c => c.name === career[career.length - 1].branch)[0];
        let skillsDisplay = careerData.sst.filter(s => !skills.hasOwnProperty(s.name))
            .map(s => <div key={`skill-${s.name}-div`} className="CESkill">
                <input type="radio" id={`skill-${s.name}`} name="skill" value={s.name} /> <label className="CESkillLabel" htmlFor={`skill-${s.name}`} >{capitalize(s.name)}</label>
            </div>);

        return (
            <form className="CECAREERS" onSubmit={selectSkill}>
                <p>Select One Skill: </p>
                {skillsDisplay}
                <input className="Submit" type="submit" value="Submit" />
            </form>
        );
    }
}