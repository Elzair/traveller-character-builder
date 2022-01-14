// These components handle a traveller attempting to apply for a promotion and give the traveller
// any benefits that come along with the promotion 

import React, { useState } from 'react';
import Switch from 'react-switch';

import { applyDMsToRoll, modRollCE/*, r2d6*/ } from './utils';
import { r2d6 } from './random';

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

// Main Promotion Component handles whether or not to display Promotion (based on `display`)  
// and whether to use Classic Traveller, Cepheus Engine, or Mongoose Traveller 2nd Edition.
export function Promotion({ game, upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onSuccess, updateLog }) {
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
function PromotionCT({ upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, onSuccess, updateLog }) {
    let [checked, setChecked] = useState(true);

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

                        if (skillData === null || skillData === undefined) { // A non-cascade skill
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

                onSuccess(true, tmpCascade ? true : false);
            } else {
                updateLog([`Sorry, you failed to get a promotion in term ${curCareer.term}.`]);

                onSuccess(false, false);
            }
        } else {
            updateLog([`You did not attempt a promotion in term ${curCareer.term}.`]);

            onSuccess(false, false);
        }

        setChecked(true); // Reset `checked`
    }

    return (
        <form onSubmit={attemptPromotion} className="Promotion">
            <p>Would you like to try for a promotion?</p>
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
function PromotionCE({ upp, updateUPP, career, updateCareer, skills, updateSkills, cascadeSkill, updateCascadeSkill, onSuccess, updateLog }) {
    let [checked, setChecked] = useState(true);

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

                let newCareer = [...career];
                newCareer[career.length - 1].rank += 1;
                updateCareer(newCareer);

                updateLog(newLog);

                if (tmpCascade) {
                    updateCascadeSkill(tmpCascade);
                }

                onSuccess(true, tmpCascade ? true : false);
            } else {
                updateLog([`Sorry, you failed to get a promotion in term ${curCareer.term}.`]);

                onSuccess(false, false);
            }
        } else {
            updateLog([`You did not attempt a promotion in term ${curCareer.term}.`]);

            onSuccess(false, false);
        }

        setChecked(true); // Reset `checked`
    }

    return (
        <form onSubmit={attemptPromotion} className="Promotion">
            <p>Would you like to try for a promotion?</p>
            <Switch checked={checked} onChange={handleCheck} />
            <input type="submit" value="Ok" />
        </form>
    );
}