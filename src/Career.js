import React from 'react';
import { applyDMsToRoll, capitalize, modRollCE, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ce/skills';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

import './Career.css';

export function Career({ game, career, updateCareer, upp, updateUPP, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onEnlistment, updateLog }) {
    if (display && game === 'classic') {
        return (
            <CareerCT
                career={career}
                updateCareer={updateCareer}
                upp={upp}
                updateUPP={updateUPP}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onEnlistment={onEnlistment}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <CareerCE
                career={career}
                updateCareer={updateCareer}
                upp={upp}
                updateUPP={updateUPP}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onEnlistment={onEnlistment}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function canEnlistCT(upp, careerName) {
    const career = CTCAREERS.filter(career => career.name === careerName)[0];
    const result = applyDMsToRoll(r2d6(), career.enlistment.dms, upp);
    return result >= career.enlistment.target;
}

function CareerCT({ career, updateCareer, upp, updateUPP, skills, updateSkills, cascadeSkill, updateCascadeSkill, onEnlistment, updateLog }) {
    function selectCareer(ev) {
        ev.preventDefault();

        let careerName = '';
        for (let c of ev.target) {
            if (c.checked) {
                careerName = c.value;
            }
        }

        if (careerName !== '') {
            // Determine if character can enlist.
            if (canEnlistCT(upp, careerName)) {
                let newLog = [`Congratulations! You have enlisted in the ${capitalize(careerName)}!`];
                let tmpCascade = null;

                // Apply any benefits for entering a career.
                const careerData = CTCAREERS.filter(c => c.name === careerName)[0];
                const rank = careerData.ranks[0];

                if (rank.hasOwnProperty('benefit')) {
                    let benefit = rank.benefit;

                    if (benefit.type === 'SKILL') {
                        const skillData = CTSKILLS[benefit.name];

                        if (skillData === null || skillData === undefined) { // a non-cascade skill
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

                updateLog(newLog);

                let newCareer = [...career];
                newCareer.push({ branch: careerName, term: 0, rank: 0, drafted: false, rankPrev: 0 });
                updateCareer(newCareer);

                if (tmpCascade) {
                    updateCascadeSkill(tmpCascade);
                }

                onEnlistment(true, tmpCascade ? true : false);
            } else {
                updateLog(`Sorry! You failed to enlist in the ${careerName}.`);

                onEnlistment(false, false);
            }
        }
    }

    let careers = CTCAREERS.map(c => <div key={`career-${c.name}-div`} className="CTCareer">
        <input type="radio" id={`career-${c.name}`} name="career" value={c.name} /> <label className="CTCareerLabel" htmlFor={`career-${c.name}`} >{capitalize(c.name)}</label>
    </div>);

    return (
        <form className="CTCareers" onSubmit={selectCareer}>
            <p>Select Career: </p>
            {careers}
            <input className="Submit" type="submit" value="Submit" />
        </form>
    );
}

function canEnlistCE(upp, careerName, numPreviousCareers) {
    const career = CECAREERS.filter(career => career.name === careerName)[0];
    const result = modRollCE(upp, career.enlistment.characteristic, false, -2 * numPreviousCareers);
    return result >= career.enlistment.target;
}

function CareerCE({ career, updateCareer, upp, updateUPP, skills, updateSkills, cascadeSkill, updateCascadeSkill, onEnlistment, updateLog }) {
    function selectCareer(ev) {
        ev.preventDefault();

        let careerName = '';
        for (let c of ev.target) {
            if (c.checked) {
                careerName = c.value;
            }
        }

        if (careerName !== '') {
            let newLog = [];

            // Determine if character can enlist.
            if (canEnlistCE(upp, careerName, career.length)) {
                newLog.push(`Congratulations! You have enlisted in the ${capitalize(careerName)}!`);
                let tmpCascade = null;

                // Apply any benefits for entering a career.
                const careerData = CECAREERS.filter(c => c.name === careerName)[0];
                const rank = careerData.ranks[0];

                if (rank.hasOwnProperty('benefit')) {
                    let benefit = rank.benefit;

                    if (benefit.type === 'SKILL') {
                        const skillData = CESKILLS[benefit.name];

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
                        newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        updateUPP(newUPP);

                        newLog.push(`Because of your rank, your ${benefit.name} is now ${newUPP[benefit.name]}.`);
                    }
                }

                let newCareer = [...career];
                newCareer.push({
                    branch: careerName,
                    term: 0,
                    rank: 0,
                    drafted: false,
                    rankPrev: 0
                });
                updateCareer(newCareer);

                if (tmpCascade) {
                    updateCascadeSkill(tmpCascade);
                }

                onEnlistment(true, tmpCascade ? true : false);
            } else {
                newLog.push(`Sorry! You did not qualify for the ${capitalize(careerName)}.`);

                onEnlistment(false, false);
            }

            updateLog(newLog);
        }
    }

    let careers = CECAREERS.map(c => <div key={`career-${c.name}-div`} className="CTCareer">
        <input type="radio" id={`career-${c.name}`} name="career" value={c.name} /> <label className="CTCareerLabel" htmlFor={`career-${c.name}`} >{capitalize(c.name)}</label>
    </div>);

    return (
        <form className="CECareers" onSubmit={selectCareer}>
            <p>Select Career: </p>
            {careers}
            <input className="Submit" type="submit" value="Submit" />
        </form>
    );
}
