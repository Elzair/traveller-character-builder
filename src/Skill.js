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
    let [cascade, setCascade] = useState(null);

    function handleSkillSelection(ev) {
        ev.preventDefault();
        for (let t of ev.target) {
            if (t.checked) {
                // Give travellers of rank 5 or 6 a +1 DM on skill table.
                const skillDM = career.rank >= 5 ? 1 : 0;

                // Pick a random skill from the skill table.
                const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
                const table = careerData[t.value];
                const adv = table[Math.min(r1d6() - 1 + skillDM, 5)];

                if (adv.type === 'CHARACTERISTIC') {
                    let newChar = {};
                    newChar[adv.name] = upp[adv.name] + adv.value;
                    updateUPP(newChar);
                    updateLog([`You have increased your ${adv.name} to ${newChar[adv.name]}.`]);
                    onSelected();
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
                        onSelected();
                    } else {
                        setCascade(adv);
                    }
                }
            }
        }
    }

    function handleCascadeSkillSelection(ev) {
        ev.preventDefault();
        for (let t of ev.target) {
            if (t.checked) {
                let newSkill = {};
                if (!skills.hasOwnProperty(t.value)) {
                    newSkill[t.value] = cascade.value;
                } else {
                    newSkill[t.value] = skills[t.value] + cascade.value;
                }
                setCascade(null); // Reset cascade skills.
                updateSkills(newSkill);
                updateLog([`You improved your ${t.value} to ${newSkill[t.value]}.`])
                onSelected();
            }
        }
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