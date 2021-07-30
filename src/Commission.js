import React from 'react';
import { useState } from 'react';
import Switch from 'react-switch';

import { applyDMsToRoll, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

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
        const curCareer = career[career.length-1]; // Get latest career

        if (input.checked) {
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
                newCareer[career.length-1].rank = rank;
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