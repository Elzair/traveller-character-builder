import { useState } from 'react';
import Switch from 'react-switch';

import { r2d6 } from './utils';

import CTCAREERS from './data/ct/careers';

export function Reenlist({ game, career, display, onSuccess, onFailure, onRetirement, updateLog }) {
    if (display && game === 'classic') {
        return (
            <ReenlistCT
                career={career}
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

function ReenlistCT({ career, onSuccess, onFailure, onRetirement, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {  
        setChecked(check);
    }

    function attemptReenlistment(ev) {
        ev.preventDefault();
        let roll = r2d6();
        const input = ev.target[0];
        if (input.checked) {
            // If the character has served 7 terms, retirement is mandatory unless the roll is 12.
            if (career.term === 7 && roll !== 12) {
                updateLog('You have served the maximum number of terms.');
                onRetirement();
            } else {
                const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
                if (roll >= careerData.reenlist.target) {
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