import React, { useState } from 'react';
import Switch from 'react-switch';

import { capitalize, r2d6 } from './utils';

import CTCAREERS from './data/ct/careers';
import CECAREERS from './data/ce/careers';

export function Reenlist({ game, career, updateCareer, options, display, onSuccess, onFailure, onRetirement, updateLog }) {
    if (display && game === 'classic') {
        return (
            <ReenlistCT
                career={career}
                updateCareer={updateCareer}
                options={options}
                onSuccess={onSuccess}
                onFailure={onFailure}
                onRetirement={onRetirement}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <ReenlistCE
                career={career}
                updateCareer={updateCareer}
                options={options}
                onSuccess={onSuccess}
                onFailure={onFailure}
                onRetirement={onRetirement}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function ReenlistCT({ career, updateCareer, options, onSuccess, onFailure, onRetirement, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {
        setChecked(check);
    }

    function attemptReenlistment(ev) {
        ev.preventDefault();

        const curCareer = career[career.length - 1]; // Get latest career
        const careerData = CTCAREERS.filter(c => c.name === curCareer.branch)[0];
        const reenlist = careerData.reenlist;

        let roll = r2d6();

        if (checked) {
            // If the character has served the maximum # of terms, retirement is mandatory unless the roll is 12.
            if (curCareer.term >= options.maxTerms && roll !== 12) {
                updateLog('You have served the maximum number of terms.');
                onRetirement();
            } else {
                // Some careers make it nearly mandatory to reenlist.
                if (roll >= reenlist.target || (reenlist.hasOwnProperty('toLeave') && reenlist.toLeave)) {
                    updateLog([`You have successfully reenlisted in the ${capitalize(curCareer.branch)} for another term.`]);

                    // Set `rankPrev` to the rank at the end of the term.
                    let newCareer = [...career];
                    newCareer[newCareer.length - 1].rankPrev = newCareer[newCareer.length - 1].rank;
                    updateCareer(newCareer);

                    onSuccess();
                } else {
                    updateLog([`Unfortunately, you are not eligible for reenlistment with the ${capitalize(curCareer.branch)}.`]);
                    onFailure();
                }
            }

        } else {
            // If the roll is a twelve, reenlistment is mandatory.
            if (roll === 12) {
                updateLog(['Your services are required for another term.']);

                // Set `rankPrev` to the rank at the end of the term.
                let newCareer = [...career];
                newCareer[newCareer.length - 1].rankPrev = newCareer[newCareer.length - 1].rank;
                updateCareer(newCareer);

                onSuccess();
            } else if (reenlist.hasOwnProperty('toLeave') && reenlist.toLeave && roll < reenlist.target) { // Some careers require a successful reenlist roll to leave
                updateLog(['You were not able to leave.']);

                // Set `rankPrev` to the rank at the end of the term.
                let newCareer = [...career];
                newCareer[newCareer.length - 1].rankPrev = newCareer[newCareer.length - 1].rank;
                updateCareer(newCareer);

                onSuccess();
            } else {
                onRetirement();
            }
        }
    }

    return (
        <form onSubmit={attemptReenlistment} className="Reenlist">
            <p>Would you like to reenlist?</p>
            <Switch checked={checked} onChange={handleCheck} />
            <input type="submit" value="Ok" />
        </form>
    );
}

function ReenlistCE({ career, updateCareer, options, onSuccess, onFailure, onRetirement, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {
        setChecked(check);
    }

    function attemptReenlistment(ev) {
        ev.preventDefault();

        const curCareer = career[career.length - 1]; // Get latest career
        const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];
        const reenlist = careerData.reenlist;

        let roll = r2d6();

        if (checked) {
            // If the character has served the maximum # of terms, retirement is mandatory unless the roll is 12.
            if (curCareer.term >= options.maxTerms && roll !== 12) {
                updateLog(['You have served the maximum number of terms.']);

                // Mandatory retirement from the current career.
                let newCareer = [...career];
                newCareer[newCareer.length - 1].retired = true;
                updateCareer(newCareer);

                onRetirement();
            } else {
                if (roll >= reenlist.target) {
                    updateLog([`You have successfully reenlisted in the ${capitalize(curCareer.branch)} for another term.`]);

                    // Set `rankPrev` to the rank at the end of the term.
                    let newCareer = [...career];
                    newCareer[newCareer.length - 1].rankPrev = newCareer[newCareer.length - 1].rank;
                    updateCareer(newCareer);

                    onSuccess();
                } else {
                    updateLog([`Unfortunately, you are not eligible for reenlistment with the ${capitalize(curCareer.branch)}.`]);

                    // A traveller is considered retired if they leave their career after serving 5+ terms.
                    if (curCareer.term >= 5) {
                        let newCareer = [...career];
                        newCareer[newCareer.length - 1].retired = true;
                        updateCareer(newCareer);
                    }

                    onFailure();
                }
            }

        } else {
            // If the roll is a twelve, reenlistment is mandatory.
            if (roll === 12) {
                updateLog(['Your services are required for another term.']);

                // Set `rankPrev` to the rank at the end of the term.
                let newCareer = [...career];
                newCareer[newCareer.length - 1].rankPrev = newCareer[newCareer.length - 1].rank;
                updateCareer(newCareer);

                onSuccess();
            } else {
                updateLog([`You have retired from the ${capitalize(curCareer.branch)}.`]);

                // A traveller is considered retired if they leave their career after serving 5+ terms.
                if (curCareer.term >= 5) {
                    let newCareer = [...career];
                    newCareer[newCareer.length - 1].retired = true;
                    updateCareer(newCareer);
                }

                onRetirement();
            }
        }
    }

    return (
        <form onSubmit={attemptReenlistment} className="Reenlist">
            <p>Would you like to reenlist?</p>
            <Switch checked={checked} onChange={handleCheck} />
            <input type="submit" value="Ok" />
        </form>
    );
}