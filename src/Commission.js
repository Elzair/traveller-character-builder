import { useState } from 'react';
import Switch from 'react-switch';

import { r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

function applyDMsToRoll(roll, dms, upp) {
    let oldroll = roll;
    for (let dm of dms) {
        if (upp[dm.characteristic] >= dm.value) {
            console.log(`Because your ${dm.characteristic} of ${upp[dm.characteristic]} is greater than or equal to ${dm.value}, your roll of ${oldroll} has been increased by ${dm.dm}.`);
            roll += dm.dm;
        }
    }
    console.log(`Your final roll is ${roll}.`);
    return roll;
}

export function Commission({ game, upp, updateUPP, career, updateCareer, skills, updateSkills, display, onSuccess, onFailure, onNoAttempt, updateLog }) {
    if (display && game === 'classic') {
        return (
            <CommissionCT
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                updateCareer={updateCareer}
                skills={skills}
                updateSkills={updateSkills}
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

function CommissionCT({ upp, updateUPP, career, updateCareer, skills, updateSkills, onSuccess, onFailure, onNoAttempt, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {
        setChecked(check);
    }

    function attemptCommission(ev) {
        ev.preventDefault();
        const input = ev.target[0];
        if (input.checked) {
            const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
            const result = applyDMsToRoll(r2d6(), careerData.commission.dms, upp);
            if (result >= careerData.commission.target) {
                onSuccess();
                // Apply any benefits for entering a career.
                const rank = careerData.ranks[career.rank+1];
                if (rank.hasOwnProperty('benefits')) {
                    rank.benefits.map(benefit => {
                        if (benefit.type === 'SKILL') {
                            // TODO: Refactor this into a general method to set a skill to a value if it is lower than that value
                            if (!skills.hasOwnProperty(benefit.name) || skills[benefit.name] < benefit.value) {
                                let newSkills = {};
                                newSkills[benefit.name] = benefit.value;
                                updateSkills(newSkills);
                                updateLog([`Because of your rank, you gain ${benefit.name}-${benefit.value}.`]);
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
            onNoAttempt();
        }
    }

    return (
        <form onSubmit={attemptCommission} className="Commission">
            <p>Would you like to try for a commission?</p>
            <Switch checked={checked} onChange={handleCheck} />
            <input type="submit" value="Ok" />
        </form>
    );
}