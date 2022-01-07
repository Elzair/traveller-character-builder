import React, { useState } from 'react';
import Switch from 'react-switch';

import { capitalize, findTerm/*, r2d6*/ } from './utils';
import { r2d6 } from './random';

import CTCAREERS from './data/ct/careers';
import CECAREERS from './data/ce/careers';

export function Reenlist({ game, career, updateCareer, age, options, display, onSuccess, onFailure, onRetirement, updateLog }) {
    if (display && game === 'classic') {
        return (
            <ReenlistCT
                career={career}
                updateCareer={updateCareer}
                age={age}
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
                age={age}
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

function ReenlistCT({ career, updateCareer, age, options, onSuccess, onFailure, onRetirement, updateLog }) {
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
        let newLog = [];
        let status = '';

        if (checked) {
            // If the character has served the maximum # of terms, retirement is mandatory unless the roll is 12.
            if (findTerm(age) > options.maxTerms && roll !== 12) {
                // updateLog('You have served the maximum number of terms.');
                newLog.push('You have served the maximum number of terms.');

                status = 'retired';

                onRetirement();
            } else {
                // Some careers make it nearly mandatory to reenlist.
                if (roll >= reenlist.target || (reenlist.hasOwnProperty('toLeave') && reenlist.toLeave)) {
                    newLog.push(`You have successfully reenlisted in the ${capitalize(curCareer.branch)} for another term.`);

                    status = 'reenlisted';

                    onSuccess();
                } else {
                    newLog.push(`Unfortunately, you are not eligible for reenlistment with the ${capitalize(curCareer.branch)}.`);

                    status = 'failure';

                    onFailure();
                }
            }

        } else {
            // If the roll is a twelve, reenlistment is mandatory.
            if (roll === 12) {
                newLog.push('Your services are required for another term.');

                status = 'reenlisted';

                onSuccess();
            } else if (reenlist.hasOwnProperty('toLeave') && reenlist.toLeave && roll < reenlist.target) { // Some careers require a successful reenlist roll to leave
                newLog.push('You were not able to leave.');

                status = 'reenlisted';

                onSuccess();
            } else {
                newLog.push('Your succesfully retired.');

                status = 'retired';

                onRetirement();
            }
        }

        updateLog(newLog);

        switch (status) {
            case 'reenlisted': {
                // Set `rankPrev` to the rank at the end of the term.
                let newCareer = [...career];
                newCareer[newCareer.length - 1].rankPrev = newCareer[newCareer.length - 1].rank;
                updateCareer(newCareer);
                onSuccess();
                break;
            }
            case 'failure':
                onFailure();
                break;
            case 'retired':
                onRetirement();
                break;
            default:
                throw new Error(`ReenlistCT::attemptReenlistment() Invalid status: ${status}`);
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

function ReenlistCE({ career, updateCareer, age, options, onSuccess, onFailure, onRetirement, updateLog }) {
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
        let newLog = [];
        let status = '';

        if (checked) {
            // If the character has served the maximum # of terms, retirement is mandatory unless the roll is 12.
            if (findTerm(age) > options.maxTerms && roll !== 12) {
                newLog.push('You have served the maximum number of terms.');

                status = 'retired';

                onRetirement();
            } else {
                // Some careers make it nearly mandatory to reenlist.
                if (roll >= reenlist.target) {
                    newLog.push(`You have successfully reenlisted in the ${capitalize(curCareer.branch)} for another term.`);

                    status = 'reenlisted';

                    onSuccess();
                } else {
                    newLog.push(`Unfortunately, you are not eligible for reenlistment with the ${capitalize(curCareer.branch)}.`);

                    status = 'failure';

                    onFailure();
                }
            }

        } else {
            // If the roll is a twelve, reenlistment is mandatory.
            if (roll === 12) {
                newLog.push('Your services are required for another term.');

                status = 'reenlisted';

                onSuccess();
            } else {
                newLog.push('Your succesfully retired.');

                status = 'retired';

                onRetirement();
            }
        }

        updateLog(newLog);

        switch (status) {
            case 'reenlisted': {
                // Set `rankPrev` to the rank at the end of the term.
                let newCareer = [...career];
                newCareer[newCareer.length - 1].rankPrev = newCareer[newCareer.length - 1].rank;
                updateCareer(newCareer);
                onSuccess();
                break;
            }
            case 'failure':
                onFailure();
                break;
            case 'retired': {
                let newCareer = [...career];
                newCareer[newCareer.length - 1].retired = true;
                updateCareer(newCareer);
                onRetirement();
                break;
            }
            default:
                throw new Error(`ReenlistCE::attemptReenlistment() Invalid status: ${status}`);
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