import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';

import { capitalize, r1d6 } from "./utils";

import CECAREERS from './data/ce/careers';
import CESKILLS from './data/ce/skills';

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
    let [cascade, setCascade] = useState(null);

    function handleChange(change) {
        setChecked(change);
    }

    function handleSelection(ev) {
        ev.preventDefault();

        let newLog = [];
        let careerName = '';
        let tmpCascade = null;

        if (checked) { // Submit to the draft
            careerName = CECAREERS.filter(career => career.draftNumber === r1d6())[0].name;
            newLog.push(`You were drafted into the ${capitalize(careerName)}`);
        } else {
            careerName = 'drifter';
            newLog.push('You became a drifter.');
        }

        // Apply any benefits for entering a career.
        const careerData = CECAREERS.filter(c => c.name === 'drifter')[0];
        const rank = careerData.ranks[0];

        if (rank.hasOwnProperty('benefit')) {
            let benefit = rank.benefit;

            if (benefit.type === 'SKILL') {
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
            drafted: true,
            rankPrev: 0
        });
        updateCareer(newCareer);

        updateLog(newLog);

        if (!tmpCascade) {
            setCascade(tmpCascade);
        } else {
            onDraft();
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

            onDraft(true);
        }
    }

    // Only allow a traveller to submit to the draft if they have not already done so before.
    useEffect(() => {
        if (career.filter(c => c.drafted).length > 0) {
            let tmpCascade = null;
            let newLog = [];

            // Apply any benefits for entering a career.
            const careerData = CECAREERS.filter(c => c.name === 'drifter')[0];
            const rank = careerData.ranks[0];

            if (rank.hasOwnProperty('benefit')) {
                let benefit = rank.benefit;

                if (benefit.type === 'SKILL') {
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
                setCascade(tmpCascade);
            } else {
                onDraft();
            }
        }
    });

    if (!cascade) {
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

