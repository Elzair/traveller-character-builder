import React, { useState } from 'react';
import Switch from 'react-switch';

import { applyDMsToRoll, modRollCE, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

export function Promotion({ game, upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSuccess, /*onFailure,*/ updateLog }) {
    if (display && game === 'classic') {
        return (
            <PromotionCT
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                updateCareer={updateCareer}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onSuccess={onSuccess}
                // onFailure={onFailure}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <PromotionCE
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                updateCareer={updateCareer}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onSuccess={onSuccess}
                // onFailure={onFailure}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function PromotionCT({ upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, onSuccess, /*onFailure,*/ updateLog }) {
    let [checked, setChecked] = useState(true);
    // let [cascade, setCascade] = useState(null);

    function handleCheck(check) {
        setChecked(check);
    }

    function attemptPromotion(ev) {
        ev.preventDefault();
        const curCareer = career[career.length - 1]; // Get latest career

        if (checked) {
            const careerData = CTCAREERS.filter(c => c.name === curCareer.branch)[0];
            let tmpCascade = null;

            const result = applyDMsToRoll(r2d6(), careerData.promotion.dms, upp);
            console.log(result);

            if (result >= careerData.promotion.target) {
                let newRank = curCareer.rank + 1;
                let newLog = [
                    `Congratulations! You are now a Rank ${newRank} ${careerData.ranks[newRank].name}.`
                ];

                // Apply any benefits for entering a career.
                if (careerData.ranks[newRank].hasOwnProperty('benefit')) {
                    const benefit = careerData.ranks[newRank].benefit;

                    if (benefit.type === 'SKILL') {
                        const skillData = CTSKILLS[benefit.name];

                        if (!skillData) { // A non-cascade skill
                            let newSkills = {};
                            newSkills[benefit.name] = (skills[benefit.name] || 0) + benefit.value;
                            updateSkills(newSkills);

                            newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
                        } else {
                            tmpCascade = benefit;
                        }
                    } else if (benefit.type === 'CHARACTERISTIC') {
                        let newUPP = {};
                        newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        updateUPP(newUPP);

                        newLog.push(`Because of your rank, your ${benefit.name} is now ${newUPP[benefit.name]}.`);
                    }
                }

                let newCareer = [...career];
                newCareer[career.length - 1].rank += 1;
                updateCareer(newCareer);

                updateLog(newLog);

                if (tmpCascade) {
                    updateCascadeSkill(tmpCascade);
                }

                onSuccess(cascadeSkill ? true : false);
            } else {
                updateLog([`Sorry, you failed to get a promotion in term ${curCareer.term}.`])
                // onFailure();
                onSuccess(false);
            }
        } else {
            updateLog([`You did not attempt a promotion in term ${curCareer.term}.`]);
            // onFailure();
            onSuccess(false);
        }

        setChecked(true); // Reset `checked`
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
    //         setCascade(null); // Reset cascade skills.

    //         updateSkills(newSkill);
    //         updateLog([`You improved your ${skill} to ${newSkill[skill]}.`]);

    //         let newCareer = [...career];
    //         newCareer[career.length - 1].rank += 1;
    //         updateCareer(newCareer);

    //         onSuccess();
    //     }
    // }

    // if (!cascade) {
        return (
            <form onSubmit={attemptPromotion} className="Promotion">
                <p>Would you like to try for a promotion?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
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

function PromotionCE({ upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, onSuccess, onFailure, updateLog }) {
    let [checked, setChecked] = useState(true);
    // let [cascade, setCascade] = useState(null);

    function handleCheck(check) {
        setChecked(check);
    }

    function attemptPromotion(ev) {
        ev.preventDefault();
        const curCareer = career[career.length - 1]; // Get latest career

        if (checked) {
            const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];
            const result = modRollCE(upp, careerData.promotion.characteristic);
            let tmpCascade = null;

            if (result >= careerData.promotion.target) {
                let newRank = curCareer.rank + 1;
                let newLog = [
                    `Congratulations! You are now a Rank ${newRank} ${careerData.ranks[newRank].name}.`
                ];

                // Apply any benefits for entering a career.
                if (careerData.ranks[newRank].hasOwnProperty('benefit')) {
                    const benefit = careerData.ranks[newRank].benefit;

                    if (benefit.type === 'SKILL') {
                        const skillData = CESKILLS[benefit.name];

                        if (skillData === null) { // A non-cascade skill
                            let newSkills = {};
                            newSkills[benefit.name] = (skills[benefit.name] || 0) + benefit.value;
                            updateSkills(newSkills);

                            newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
                        } else { // Transition to cascade skill selection
                            updateLog(newLog);
                            tmpCascade = benefit;
                        }
                    } else if (benefit.type === 'CHARACTERISTIC') {
                        let newUPP = {};
                        newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        updateUPP(newUPP);

                        newLog.push(`Because of your rank, your ${benefit.name} is now ${newUPP[benefit.name]}.`);
                    }
                }

                let newCareer = [...career];
                newCareer[career.length - 1].rank += 1;
                updateCareer(newCareer);

                updateLog(newLog);

                if (tmpCascade) {
                    // setCascade(tmpCascade);
                    updateCascadeSkill(tmpCascade);
                } /*else {
                    onSuccess();
                }*/
                onSuccess(tmpCascade ? true : false);

            } else {
                updateLog([`Sorry, you failed to get a promotion in term ${curCareer.term}.`])
                // onFailure();
                onSuccess(false);
            }
        } else {
            updateLog([`You did not attempt a promotion in term ${curCareer.term}.`]);
            // onFailure();
            onSuccess(false);
        }

        setChecked(true); // Reset `checked`
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
    //         let newSkills = {};
    //         newSkills[skill] = (skills[skill] || 0) + cascade.value;

    //         setCascade(null); // Reset cascade skills.

    //         updateSkills(newSkills);
    //         updateLog([`You improved your ${skill} to ${newSkills[skill]}.`]);

    //         onSuccess();
    //     }
    // }

    // if (!cascade) {
    return (
        <form onSubmit={attemptPromotion} className="Promotion">
            <p>Would you like to try for a promotion?</p>
            <Switch checked={checked} onChange={handleCheck} />
            <input type="submit" value="Ok" />
        </form>
    );
    // } else {
    //     const skillData = CESKILLS[cascade.name];
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