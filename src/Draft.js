// These components handle travellers being drafted into a career (and possibly gaining benefits from the entry level).

import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';

import { capitalize/*, r1d6*/ } from './utils';
import { r1d6 } from './random';

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';
import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

import './default.css';

// Main Draft Component handles whether or not to display Draft (based on `display`)  
// and whether to use Classic Traveller, Cepheus Engine, or Mongoose Traveller 2nd Edition.
export function Draft({ game, career, updateCareer, upp, updateUPP, skills, updateSkills, cascadeSkill, updateCascadeSkill, display, onDraft, updateLog }) {
    if (display && game === 'classic') {
        return (
            <DraftCT
                career={career}
                updateCareer={updateCareer}
                upp={upp}
                updateUPP={updateUPP}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onDraft={onDraft}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <DraftCE
                career={career}
                updateCareer={updateCareer}
                upp={upp}
                updateUPP={updateUPP}
                skills={skills}
                updateSkills={updateSkills}
                cascadeSkill={cascadeSkill}
                updateCascadeSkill={updateCascadeSkill}
                onDraft={onDraft}
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

function DraftCT({ career, updateCareer, upp, updateUPP, skills, updateSkills, cascadeSkill, updateCascadeSkill, onDraft, updateLog }) {
    useEffect(() => {
        let tmpCascade = null;
        let newLog = [];

        // Apply any benefits for entering a career.
        const draftNumber = r1d6();
        const careerName = CTCAREERS.filter(career => career.draftNumber === draftNumber)[0].name;
        const careerData = CTCAREERS.filter(c => c.name === careerName)[0];
        const rank = careerData.ranks[0];

        newLog.push(`You were drafted into the ${capitalize(careerName)}`);

        if (rank.hasOwnProperty('benefit')) {
            let benefit = rank.benefit;

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
            drafted: true,
            failedBranch: '',
            rankPrev: 0
        });
        updateCareer(newCareer);

        updateLog(newLog);

        if (tmpCascade) {
            updateCascadeSkill(tmpCascade);
        }

        onDraft(tmpCascade ? true : false);
    });

    return (<div></div>);
}

// ..######..########.########..##.....##.########.##.....##..######.
// .##....##.##.......##.....##.##.....##.##.......##.....##.##....##
// .##.......##.......##.....##.##.....##.##.......##.....##.##......
// .##.......######...########..#########.######...##.....##..######.
// .##.......##.......##........##.....##.##.......##.....##.......##
// .##....##.##.......##........##.....##.##.......##.....##.##....##
// ..######..########.##........##.....##.########..#######...######.

function DraftCE({ career, updateCareer, upp, updateUPP, skills, updateSkills, cascadeSkill, updateCascadeSkill, onDraft, updateLog }) {
    let [checked, setChecked] = useState(false);

    function handleChange(change) {
        setChecked(change);
    }

    function handleSelection(ev) {
        ev.preventDefault();

        let newLog = [];
        let careerName = '';
        let tmpCascade = null;

        if (checked) { // Submit to the draft
            const draftNumber = r1d6();
            careerName = CECAREERS.filter(career => career.draftNumber === draftNumber)[0].name;
            newLog.push(`You were drafted into the ${capitalize(careerName)}`);
        } else {
            careerName = 'drifter';
            newLog.push('You became a Drifter.');
        }

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
            drafted: true,
            rankPrev: 0
        });
        updateCareer(newCareer);

        updateLog(newLog);

        if (tmpCascade) {
            updateCascadeSkill(tmpCascade);
        }

        onDraft(tmpCascade ? true : false);
    }

    // Only allow a traveller to submit to the draft if they have not already done so before.
    useEffect(() => {
        if (career.filter(c => c.drafted).length > 0) {
            let tmpCascade = null;
            let newLog = [];

            newLog.push('With no other options, you have become a Drifter.');

            // // Apply any benefits for entering a career.
            // const careerData = CECAREERS.filter(c => c.name === 'drifter')[0];
            // const rank = careerData.ranks[0];

            // if (rank.hasOwnProperty('benefit')) {
            //     let benefit = rank.benefit;

            //     if (benefit.type === 'SKILL') {
            //         const skillData = CESKILLS[benefit.name];

            //         if (skillData === null) { // a non-cascade skill
            //             let newSkills = {};
            //             newSkills[benefit.name] = (skills[benefit.name] || 0) + benefit.value;
            //             updateSkills(newSkills);

            //             newLog.push(`Because of your rank, you gain ${benefit.name}-${benefit.value}.`);
            //         } else { // Transition to cascade skill selection
            //             tmpCascade = benefit;
            //         }
            //     } else if (benefit.type === 'CHARACTERISTIC') {
            //         let newUPP = {};
            //         newUPP[benefit.name] = upp[benefit.name] + benefit.value;
            //         updateUPP(newUPP);

            //         newLog.push(`Because of your rank, your ${benefit.name} is now ${newUPP[benefit.name]}.`);
            //     }
            // }

            let newCareer = [...career];
            newCareer.push({
                branch: 'drifter',
                term: 0,
                rank: 0,
                drafted: false,
                failedBranch: '',
                rankPrev: 0
            });
            updateCareer(newCareer);

            updateLog(newLog);

            if (tmpCascade) {
                updateCascadeSkill(tmpCascade);
            }

            onDraft(tmpCascade ? true : false);
        }
    });

    // Only allow a traveller to submit to the draft if they have not already done so before.
    if (career.filter(c => c.drafted).length > 0) {
        return (<div></div>);
    } else {
        return (
            <div className="Draft">
                <p className="Header">Do you want to become a Drifter or attempt the Draft?</p>
                <form onSubmit={handleSelection} className="Draft">
                    <Switch
                        checked={checked}
                        onChange={handleChange}
                        offColor="#0aa"
                        onColor="#a00"
                        offHandleColor="#0ff"
                        onHandleColor="#f00"
                        uncheckedIcon={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: 'black'
                                }}
                            >
                                Drifter
                            </div>
                        }
                        checkedIcon={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: 'white'
                                }}
                            >
                                Draft
                            </div>
                        }
                    />
                    <input className="Submit" type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

