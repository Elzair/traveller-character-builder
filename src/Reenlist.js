import React from 'react';
import { useState } from 'react';
import Switch from 'react-switch';

import { r2d6 } from './utils';

import CTCAREERS from './data/ct/careers';

export function Reenlist({ game, career, options, display, onSuccess, onFailure, onRetirement, updateLog }) {
    if (display && game === 'classic') {
        return (
            <ReenlistCT
                career={career}
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

function ReenlistCT({ career, options, onSuccess, onFailure, onRetirement, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {  
        setChecked(check);
    }

    function attemptReenlistment(ev) {
        ev.preventDefault();

        const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
        const reenlist = careerData.reenlist;

        let roll = r2d6();

        const input = ev.target[0];
        if (input.checked) {
            // If the character has served the maximum # of terms, retirement is mandatory unless the roll is 12.
            if (career.term >= options.maxTerms && roll !== 12) {
                updateLog('You have served the maximum number of terms.');
                onRetirement();
            } else {
                // Some careers make it nearly mandatory to reenlist.
                if (roll >= reenlist.target || (reenlist.hasOwnProperty('toLeave') && reenlist.toLeave)) {
                    onSuccess();
                } else {
                    onFailure();
                }
            }
            
        } else {
            // If the roll is a twelve, reenlistment is mandatory.
            if (roll === 12) {
                updateLog(['Your services are required for another term.']);
                onSuccess();
            } else if (reenlist.hasOwnProperty('toLeave') && reenlist.toLeave && roll < reenlist.target) { // Some careers require a successful reenlist roll to leave
                updateLog(['You were not able to leave.']);
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