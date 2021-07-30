import React from 'react';
import { applyDMsToRoll, capitalize, r1d6, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

import './Career.css';

export function Career({ game, career, updateCareer, upp, updateUPP, skills, updateSkills, display, onEnlistment, onDraft, updateLog }) {
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
                onDraft={onDraft}
                updateLog={updateLog}
            />);
    } else {
        return (<div></div>);
    }
}

function canEnlist(upp, careerName) {
    const career = CTCAREERS.filter(career => career.name === careerName)[0];
    const result = applyDMsToRoll(r2d6(), career.enlistment.dms, upp);
    return result >= career.enlistment.target;
}

function draft() {
    const roll = r1d6();
    return CTCAREERS.filter(career => career.draftNumber === roll)[0].name;
}

function CareerCT({ career, updateCareer, upp, updateUPP, skills, updateSkills, onEnlistment, onDraft, updateLog }) {
    function selectCareer(ev) {
        ev.preventDefault();
        for (let c of ev.target) {
            if (c.checked) {
                console.log(`Enlisting in the ${c.value}`);
                let careerName = '';
                // Determine if character can enlist.
                if (canEnlist(upp, c.value)) {
                    careerName = c.value;
                    let newLog = [`Congratulations! You have enlisted in the ${capitalize(careerName)}!`]

                    // Apply any benefits for entering a career.
                    const careerData = CTCAREERS.filter(c => c.name === careerName)[0];
                    const rank = careerData.ranks[0];
                    if (rank.hasOwnProperty('benefit')) {
                        let benefit = rank.benefit;
                        if (benefit.type === 'SKILL') {
                            // TODO: Refactor this into a general method to set a skill to a value if it is lower than that value.
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
                    // onEnlistment({ branch: careerName, term: 0, rank: 0 });
                    let newCareer = [...career];
                    newCareer.push({branch: careerName, term: 0, rank: 0, drafted: false, rankPrev: 0});
                    updateCareer(newCareer);
                    onEnlistment();
                } else {
                    careerName = draft();
                    let newLog = [
                        `Sorry! You did not qualify for the ${capitalize(c.value)}.`,
                        `Instead, you were drafted into the ${capitalize(careerName)}.`,
                    ];

                    // Apply any benefits for entering a career.
                    const careerData = CTCAREERS.filter(c => c.name === careerName)[0];
                    const rank = careerData.ranks[0];
                    if (rank.hasOwnProperty('benefit')) {
                        let benefit = rank.benefit;
                        if (benefit.type === 'SKILL') {
                            // TODO: Refactor this into a general method to set a skill to a value if it is lower than that value.
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
                    newCareer.push({ branch: careerName, failedBranch: c.value, term: 0, rank: 0, drafted: true, rankPrev: 0 });
                    updateCareer(newCareer);
                    onDraft();
                    // onDraft({ branch: careerName, failedBranch: c.value, term: 0, rank: 0 });
                }
            }
        }
    }

    let careers = CTCAREERS.map(c => <div key={`career-${c.name}-div`} className="CTCareer">
        <input type="radio" id={`career-${c.name}`} name="career" value={c.name} /> <label className="CTCareerLabel" htmlFor={`career-${c.name}`} >{capitalize(c.name)}</label>
    </div>);
    // console.log(careers);

    // return (
    //     <form onSubmit={selectCareer}>
    //         <p>Select Career: </p>
    //         <input type="radio" id="car1" name="career" value="navy" /> <label for="car1">Navy</label>
    //         <input type="radio" id="car2" name="career" value="marines" /> <label for="car2">Marines</label>
    //         <input type="radio" id="car3" name="career" value="army" /> <label for="car3">Army</label>
    //         <input type="radio" id="car4" name="career" value="scouts" /> <label for="car4">Scouts</label>
    //         <input type="radio" id="car5" name="career" value="merchant" /> <label for="car5">Merchants</label>
    //         <input type="radio" id="car6" name="career" value="other" /> <label for="car6">Other</label>
    //         <input type="submit" value="Submit" />
    //     </form>
    // );
    return (
        <form className="CTCareers" onSubmit={selectCareer}>
            <p>Select Career: </p>
            {careers}
            <input className="Submit" type="submit" value="Submit" />
        </form>
    );

}
