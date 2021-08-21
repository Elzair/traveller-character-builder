import React from 'react';

// import { applyDMsToRoll, modRollCE, r2d6 } from "./utils";

import CTSKILLS from './data/ct/skills';
import CESKILLS from './data/ce/skills';

export function CascadeSkill({ game, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSelected, updateLog }) {
    if (display && game === 'classic') {
        return (
            <CascadeSkillCT
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onSelected={onSelected}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <CascadeSkillCE
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onSelected={onSelected}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function CascadeSkillCT({ skills, updateSkills, cascadeSkill, updateCascadeSkill, onSelected, updateLog }) {
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
                newSkill[skill] = cascadeSkill.value;
            } else {
                newSkill[skill] = skills[skill] + cascadeSkill.value;
            }

            updateCascadeSkill(null);
            updateSkills(newSkill);
            updateLog([`You improved your ${skill} to ${newSkill[skill]}.`]);

            onSelected();
        }
    }

    const skillData = CTSKILLS[cascadeSkill.name];
    const optionElts = Object.keys(skillData).map(skill => (
        <label>
            <input type="radio" id={skill} name="cascadeskill" value={skill} />
            {skill}
        </label>
    ));

    return (
        <div>
            {<form onSubmit={handleCascadeSkillSelection}>
                <label>{`Choose a specific focus of ${cascadeSkill.name}:`}</label>
                {optionElts}
                <input type="submit" value="Submit" />
            </form>}
        </div>
    );
}


function CascadeSkillCE({ skills, updateSkills, cascadeSkill, updateCascadeSkill, onSelected, updateLog }) {
    function handleCascadeSkillSelection(ev) {
        ev.preventDefault();

        let skill = '';
        for (let t of ev.target) {
            if (t.checked) {
                skill = t.value;
            }
        }

        if (skill !== '') {
            let newSkills = {};
            newSkills[skill] = (skills[skill] || 0) + cascadeSkill.value;

            updateCascadeSkill(null);
            updateSkills(newSkills);
            updateLog([`You improved your ${skill} to ${newSkills[skill]}.`]);

            onSelected();
        }
    }

    const skillData = CESKILLS[cascadeSkill.name];
    const optionElts = Object.keys(skillData).map(skill => (
        <label>
            <input type="radio" id={skill} name="cascadeskill" value={skill} />
            {skill}
        </label>
    ));

    return (
        <div>
            {<form onSubmit={handleCascadeSkillSelection}>
                <label>{`Choose a specific focus of ${cascadeSkill.name}:`}</label>
                {optionElts}
                <input type="submit" value="Submit" />
            </form>}
        </div>
    );
}