import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';

import { r1d6 } from "./utils";

import CECAREERS from './data/ce/careers';

import './default.css';

export function Draft({ game, career, updateCareer, upp, updateUPP, skills, updateSkills, display, onDraft, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <DraftCE
                career={career}
                updateCareer={updateCareer}
                upp={upp}
                updateUPP={updateUPP}
                skills={skills}
                updateSkills={updateSkills}
                onDraft={onDraft}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function DraftCE({ career, updateCareer, upp, updateUPP, skills, updateSkills, onDraft, updateLog }) {
    let [checked, setChecked] = useState(false);

    function handleChange(change) {
        setChecked(change);
    }

    function handleSelection(ev) {
        ev.preventDefault();

        let careerName = '';
        if (checked) { // Submit to the draft
            careerName= CECAREERS.filter(career => career.draftNumber === r1d6())[0].name;
        } else  {
            careerName = 'drifter';
        }

        // Apply any benefits for entering a career.
        const careerData = CECAREERS.filter(c => c.name === 'drifter')[0];
        const rank = careerData.ranks[0];
        let newLog = [];

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
        onDraft();
    }

    // Only allow a traveller to submit to the draft if they have not already done so before.
    if (career.filter(c => c.drafted).length > 0) {
        useEffect(() => {
            let newLog = [];

            // Apply any benefits for entering a career.
            const careerData = CECAREERS.filter(c => c.name === 'drifter')[0];
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
            onDraft();
        });

        return (<div></div>);
    }

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

