import { useState } from 'react';
import Switch from 'react-switch';

import { applyDMsToRoll, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';

export function Promotion({ game, upp, updateUPP, career, updateCareer, skills, updateSkills, display, onSuccess, onFailure, updateLog }) {
    if (display && game === 'classic') {
        return (
            <PromotionCT
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                updateCareer={updateCareer}
                skills={skills}
                updateSkills={updateSkills}
                onSuccess={onSuccess}
                onFailure={onFailure}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function PromotionCT({ upp, updateUPP, career, updateCareer, skills, updateSkills, onSuccess, onFailure, updateLog }) {
    let [checked, setChecked] = useState(true);
    let [cascade, setCascade] = useState(null);

    function handleCheck(check) {
        setChecked(check);
    }

    function attemptPromotion(ev) {
        ev.preventDefault();
        const input = ev.target[0];
        if (input.checked) {
            const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
            const result = applyDMsToRoll(r2d6(), careerData.promotion.dms, upp);
            if (result >= careerData.promotion.target) {
                onSuccess();
                // Apply any benefits for entering a career.
                const rank = careerData.ranks[career.rank + 1];
                if (rank.hasOwnProperty('benefits')) {
                    rank.benefits.forEach(benefit => {
                        if (benefit.type === 'SKILL') {
                            // TODO: Find a better way to do this. If there is more than one cascading benefit,
                            // setting the state will likely screw up everything.
                            const skillData = CTSKILLS[benefit.name];
                            if (skillData === null) { // A non-cascade skill
                                if (!skills.hasOwnProperty(benefit.name) || skills[benefit.name] < benefit.value) {
                                    let newSkills = {};
                                    newSkills[benefit.name] = benefit.value;
                                    updateSkills(newSkills);
                                    updateLog([`Because of your rank, you gain ${benefit.name}-${benefit.value}.`]);
                                }
                            } else {
                                setCascade(benefit);
                            }
                        } else if (benefit.type === 'CHARACTERISTIC') {
                            let newUPP = {};
                            newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                            updateUPP(newUPP);
                            updateLog([`Because of your rank, your ${benefit.name} is now ${newUPP[benefit.name]}.`]);
                        }
                    });
                }
            } else {
                onFailure();
            }
        } else {
            onFailure();
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
                updateLog([`You improved your ${t.value} to ${newSkill[t.value]}.`]);
            }
        }
    }

    if (!cascade) {
        return (
            <form onSubmit={attemptPromotion} className="Promotion">
                <p>Would you like to try for a promotion?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
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