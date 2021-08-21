import React, { useState } from 'react';
import Switch from 'react-switch';

import { applyDMsToRoll, modRollCE, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

export function Commission({ game, upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSuccess, onFailure, onNoAttempt, updateLog }) {
    if (display && game === 'classic') {
        return (
            <CommissionCT
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                updateCareer={updateCareer}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onSuccess={onSuccess}
                onFailure={onFailure}
                onNoAttempt={onNoAttempt}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <CommissionCE
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                updateCareer={updateCareer}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onSuccess={onSuccess}
                onFailure={onFailure}
                onNoAttempt={onNoAttempt}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function CommissionCT({ upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, onSuccess, onFailure, onNoAttempt, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {
        setChecked(check);
    }

    function attemptCommission(ev) {
        ev.preventDefault();
        const curCareer = career[career.length - 1]; // Get latest career

        if (checked) {
            const careerData = CTCAREERS.filter(c => c.name === curCareer.branch)[0];
            const commission = careerData.commission;

            const result = applyDMsToRoll(r2d6(), commission.dms, upp);
            if (result >= commission.target) {
                let newLog = [];
                let rank = 0;

                // Some careers have initial ranks correspond to Social Standing
                if (commission.hasOwnProperty('correspondToSocial') && commission.correspondToSocial) {
                    rank = careerData.ranks.findIndex(r => r.hasOwnProperty('social') && r.social === upp.Social);
                    if (rank === -1) {
                        rank = 1;
                    }
                } else {
                    rank = 1;
                }

                newLog.push(`Congratulations! You are now a Rank ${rank} ${careerData.ranks[rank].name}.`);

                // Apply any benefits for entering a career.
                if (careerData.ranks[rank].hasOwnProperty('benefit')) {
                    const benefit = careerData.ranks[rank].benefit;

                    if (benefit.type === 'SKILL') {
                        // TODO: Refactor this into a general method to set a skill to a value if it is lower than that value
                        if (!skills.hasOwnProperty(benefit.name) || skills[benefit.name] < benefit.value) {
                            let newSkills = {};
                            newSkills[benefit.name] = benefit.value;
                            updateSkills(newSkills);
                            newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
                        }
                    } else if (benefit.type === 'CHARACTERISTIC') {
                        let newUPP = {};

                        if (benefit.hasOwnProperty('set') && benefit.set) {
                            newUPP[benefit.name] = benefit.value;
                        } else {
                            newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        }

                        updateUPP(newUPP);
                        newLog.push(`Because of your rank, your ${benefit.name} is now ${newUPP[benefit.name]}.`);
                    }
                }

                updateLog(newLog);

                // Update current career
                let newCareer = [...career];
                newCareer[career.length - 1].rank = rank;
                updateCareer(newCareer);

                onSuccess();
            } else {
                updateLog([`Sorry, you failed to get a commission in term ${curCareer.term}.`]);
                onFailure();
            }
        } else {
            onNoAttempt();
        }

        setChecked(true); // Reset `checked`
    }

    return (
        <form onSubmit={attemptCommission} className="Commission">
            <p>Would you like to try for a commission?</p>
            <Switch checked={checked} onChange={handleCheck} />
            <input type="submit" value="Ok" />
        </form>
    );
}

function CommissionCE({ upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, onSuccess, onFailure, onNoAttempt, updateLog }) {
    let [checked, setChecked] = useState(true);
    // let [cascade, setCascade] = useState(null);

    function handleCheck(check) {
        setChecked(check);
    }

    function attemptCommission(ev) {
        ev.preventDefault();
        const curCareer = career[career.length - 1]; // Get latest career

        if (checked) {
            const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];
            const commission = careerData.commission;
            let tmpCascade = null;

            const result = modRollCE(upp, commission.characteristic);
            if (result >= commission.target) {
                let newLog = [];
                let rank = 1;

                newLog.push(`Congratulations! You are now a Rank ${rank} ${careerData.ranks[rank].name}.`);

                // Apply any benefits for entering a career.
                if (careerData.ranks[rank].hasOwnProperty('benefit')) {
                    const benefit = careerData.ranks[rank].benefit;

                    if (benefit.type === 'SKILL') {
                        const skillData = CESKILLS[benefit.name];

                        if (skillData === null) { // A non-cascade skill
                            let newSkills = {};
                            newSkills[benefit.name] = (skills[benefit.name] || 0) + benefit.value;
                            updateSkills(newSkills);

                            newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
                        } else { // Transition to cascade skill selection
                            // updateLog(newLog);
                            tmpCascade = benefit;
                        }

                    } else if (benefit.type === 'CHARACTERISTIC') {
                        let newUPP = {};
                        newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        updateUPP(newUPP);

                        newLog.push(`Because of your rank, your ${benefit.name} is now ${newUPP[benefit.name]}.`);
                    }
                }

                updateLog(newLog);

                // Update current career
                let newCareer = [...career];
                newCareer[career.length - 1].rank = rank;
                updateCareer(newCareer);

                if (tmpCascade) {
                    // setCascade(tmpCascade);
                    updateCascadeSkill(tmpCascade);
                } /*else {
                    onSuccess();
                }*/
                onSuccess(tmpCascade ? true : false);
            } else {
                updateLog([`Sorry, you failed to get a commission in term ${curCareer.term}.`]);
                onFailure();
            }
        } else {
            onNoAttempt();
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
            <form onSubmit={attemptCommission} className="Commission">
                <p>Would you like to try for a commission?</p>
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