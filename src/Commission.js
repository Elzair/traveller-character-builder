// These components handle travellers applying for a commission (and possibly gaining benefits from the commission).

import React, { useState } from 'react';
import Switch from 'react-switch';

import { applyDMsToRoll, modRollCE/*, r2d6*/ } from './utils';
import { r2d6 } from './random';

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

// Main Commission Component handles whether or not to display Commission (based on `display`)  
// and whether to use Classic Traveller, Cepheus Engine, or Mongoose Traveller 2nd Edition.
export function Commission({ game, upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSuccess, updateLog }) {
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

function CommissionCT({ upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, onSuccess, updateLog }) {
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
                let tmpCascade = null;

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
                        const skillData = CTSKILLS[benefit.name];

                        if (skillData === null || skillData === undefined) { // a non-cascade skill
                            let newSkills = {};
                            newSkills[benefit.name] = (skills[benefit.name] || 0) + benefit.value;
                            updateSkills(newSkills);

                            newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
                        } else { // Transition to cascade skill selection
                            tmpCascade = benefit;
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

                // Update current career
                let newCareer = [...career];
                newCareer[career.length - 1].rank = rank;
                updateCareer(newCareer);

                updateLog(newLog);

                if (tmpCascade) {
                    updateCascadeSkill(tmpCascade);
                }

                onSuccess(true, tmpCascade ? true : false);
            } else {
                updateLog([`Sorry, you failed to get a commission in term ${curCareer.term}.`]);
                
                onSuccess(false, false);
            }
        } else {
            updateLog([`You did not attempt a commission in term ${curCareer.term}.`]);

            onSuccess(false, false);
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

// ..######..########.########..##.....##.########.##.....##..######.
// .##....##.##.......##.....##.##.....##.##.......##.....##.##....##
// .##.......##.......##.....##.##.....##.##.......##.....##.##......
// .##.......######...########..#########.######...##.....##..######.
// .##.......##.......##........##.....##.##.......##.....##.......##
// .##....##.##.......##........##.....##.##.......##.....##.##....##
// ..######..########.##........##.....##.########..#######...######.

function CommissionCE({ upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, onSuccess, /*onFailure, onNoAttempt,*/ updateLog }) {
    let [checked, setChecked] = useState(true);

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

                        if (skillData === null || skillData === undefined) { // A non-cascade skill
                            let newSkills = {};
                            newSkills[benefit.name] = (skills[benefit.name] || 0) + benefit.value;
                            updateSkills(newSkills);

                            newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
                        } else { // Transition to cascade skill selection
                            tmpCascade = benefit;
                        }

                    } else if (benefit.type === 'CHARACTERISTIC') {
                        let newUPP = {};
                        newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        updateUPP(newUPP);

                        newLog.push(`Because of your rank, your ${benefit.name} is now ${newUPP[benefit.name]}.`);
                    }
                }

                // Update current career
                let newCareer = [...career];
                newCareer[career.length - 1].rank = rank;
                updateCareer(newCareer);

                updateLog(newLog);

                if (tmpCascade) {
                    updateCascadeSkill(tmpCascade);
                }

                onSuccess(true, tmpCascade ? true : false);
            } else {
                updateLog([`Sorry, you failed to get a commission in term ${curCareer.term}.`]);

                onSuccess(false, false);
            }
        } else {
            updateLog([`You did not attempt a commission in term ${curCareer.term}.`]);
            
            onSuccess(false, false)
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