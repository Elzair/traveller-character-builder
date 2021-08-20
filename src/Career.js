import React, { useState } from 'react';
import { applyDMsToRoll, capitalize, modRollCE, r1d6, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

import './Career.css';

export function Career({ game, career, updateCareer, upp, updateUPP, skills, updateSkills, display, onEnlistment, updateLog }) {
    if (display && game === 'classic') {
        return (
            <CareerCT
                career={career}
                updateCareer={updateCareer}
                upp={upp}
                updateUPP={updateUPP}
                skills={skills}
                updateSkills={updateSkills}
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

function draftCT() {
    const roll = r1d6();
    return CTCAREERS.filter(career => career.draftNumber === roll)[0].name;
}

function CareerCT({ career, updateCareer, upp, updateUPP, skills, updateSkills, onEnlistment, updateLog }) {
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
                let newLog = [`Congratulations! You have enlisted in the ${capitalize(careerName)}!`]

                // Apply any benefits for entering a career.
                const careerData = CTCAREERS.filter(c => c.name === careerName)[0];
                const rank = careerData.ranks[0];

                if (rank.hasOwnProperty('benefit')) {
                    let benefit = rank.benefit;

                    if (benefit.type === 'SKILL') {
                        // Set a skill to a value if it is lower than that value.
                        if (!skills.hasOwnProperty(benefit.name) || skills[benefit.name] < benefit.value) {
                            let newSkills = {};
                            newSkills[benefit.name] = benefit.value;
                            updateSkills(newSkills);

                            newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
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

                onEnlistment(true);
            } else {
                const draftName = draftCT();
                let newLog = [
                    `Sorry! You did not qualify for the ${capitalize(careerName)}.`,
                    `Instead, you were drafted into the ${capitalize(draftName)}.`,
                ];

                // Apply any benefits for entering a career.
                const careerData = CTCAREERS.filter(c => c.name === draftName)[0];
                const rank = careerData.ranks[0];

                if (rank.hasOwnProperty('benefit')) {
                    let benefit = rank.benefit;

                    if (benefit.type === 'SKILL') {
                        // Set a skill to a value if it is lower than that value.
                        if (!skills.hasOwnProperty(benefit.name) || skills[benefit.name] < benefit.value) {
                            let newSkills = {};
                            newSkills[benefit.name] = benefit.value;
                            updateSkills(newSkills);

                            newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
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
                newCareer.push({ branch: draftName, term: 0, rank: 0, drafted: true, rankPrev: 0 });
                updateCareer(newCareer);
                onEnlistment(true);
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

function canEnlistCE(upp, careerName) {
    console.log(upp);
    console.log(careerName);
    const career = CECAREERS.filter(career => career.name === careerName)[0];
    const result = modRollCE(upp, career.enlistment.characteristic);
    return result >= career.enlistment.target;
}

function CareerCE({ career, updateCareer, upp, updateUPP, skills, updateSkills, onEnlistment, updateLog }) {
    let [cascade, setCascade] = useState(null);

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
            if (canEnlistCE(upp, careerName)) {
                newLog.push(`Congratulations! You have enlisted in the ${capitalize(careerName)}!`);
                let tmpCascade = null;

                // Apply any benefits for entering a career.
                const careerData = CECAREERS.filter(c => c.name === careerName)[0];
                const rank = careerData.ranks[0];

                if (rank.hasOwnProperty('benefit')) {
                    let benefit = rank.benefit;
                    console.log('You have a benefit');

                    if (benefit.type === 'SKILL') {
                        console.log(benefit);
                        const skillData = CESKILLS[benefit.name];

                        if (skillData === null) { // a non-cascade skill
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
                    setCascade(tmpCascade);
                } else {
                    onEnlistment(true);
                }
            } else {
                newLog.push(`Sorry! You did not qualify for the ${capitalize(careerName)}.`);

                onEnlistment(false);
            }

            updateLog(newLog);
        }
    }

    function handleCascadeSkillSelection(ev) {
        ev.preventDefault();

        let skill = '';
        for (let t of ev.target) {
            if (t.checked) {
                skill = t.value;
            }
        }

        if (skill !== '') {
            let newSkills = {};
            newSkills[skill] = (skills[skill] || 0) + cascade.value;

            setCascade(null); // Reset cascade skills.
            updateSkills(newSkills);
            updateLog([`You improved your ${skill} to ${newSkills[skill]}.`]);

            onEnlistment(true);
        }
    }

    if (!cascade) {
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
    } else {
        const skillData = CESKILLS[cascade.name];
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
