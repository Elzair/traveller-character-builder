import { r1d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';

export function Skill({game, upp, updateUPP, career, skills, updateSkills, display, onSelected, updateLog}) {
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
            />);
    } else {
        return (<div></div>);
    }
}

function SkillCT({game, upp, updateUPP, career, skills, updateSkills, display, onSelected, updateLog}) {
    function handleSkillSelection(ev) {
        ev.preventDefault();
        for (let t of ev.target) {
            if (t.checked) {
                const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
                const table = careerData[t.value];
                const adv = table[r1d6()-1];

                if (adv.type === 'CHARACTERISTIC') {
                    let newChar = {};
                    newChar[adv.name] = upp[adv.name] + adv.value;
                    updateUPP(newChar);
                    updateLog([`You have increased your ${adv.name} to ${newChar[adv.name]}.`]);
                    onSelected();
                } else if (adv.type === 'SKILL') {
                    const skillData = CTSKILLS[adv.name];
                    if (skillData === null) {
                        let newSkill = {};
                        if (!skills.hasOwnProperty(adv.name)) {
                            newSkill[adv.name] = adv.value;
                        } else {
                            newSkill[adv.name] = skills[adv.name] + adv.value;
                        }
                        updateSkills(newSkill);
                        onSelected();
                    } else {
                        console.log('Cascade skills are not yet implemented!');
                        onSelected();
                    }
                }
            }
        }
    }

    let options = {
        "pdt": "Personal Development",
        "sst": "Service Skills",
        "aet1": "Advanced Education",
    };
    if (upp.Education >= 8) {
        options['aet2'] = "Advanced Education 2";
    }
    const optionElts = Object.keys(options).map(prop => (
        <label>
            <input type="radio" id={prop} name="skilltable" value={prop}/>
            {options[prop]}
        </label>
    ));
    console.log(optionElts);
    
    return (
        <div>
            {<form onSubmit={handleSkillSelection}>
                <label>Choose an area to improve:</label>
                {optionElts}
                <input type="submit" value="Submit"/>
            </form>}
        </div>
    );
}