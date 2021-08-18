import React, { useState } from 'react';
import Switch from 'react-switch';

import { r1d6 } from './utils';

export function Anagathics({ game, anagathics, updateAnagathics, /*updateDebt,*/ updateCredits, display, onAnagathicsDecision, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <AnagathicsCE
                anagathics={anagathics}
                updateAnagathics={updateAnagathics}
                // updateDebt={updateDebt}
                updateCredits={updateCredits}
                onAnagathicsDecision={onAnagathicsDecision}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function AnagathicsCE({ anagathics, updateAnagathics, /*updateDebt,*/ updateCredits, onAnagathicsDecision, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {
        setChecked(check);
    }

    function decision(ev) {
        ev.preventDefault();

        if (checked) {
            updateLog(`You decided to take Anagathics for this term.`);
            updateAnagathics(true);
            // updateDebt(r1d6() * 2500);
            updateCredits(r1d6() * -2500);
        } else {
            updateLog(`You decided to not take Anagathics for this term.`);
            updateAnagathics(false);
        }

        onAnagathicsDecision();
        setChecked(false); // Reset `checked`
    }

    return (
        <form onSubmit={decision} className="Commission">
            <p>Would you like to take Anagathics (i.e. anti-aging drugs) for this term?</p>
            <Switch checked={checked} onChange={handleCheck} />
            <input type="submit" value="Ok" />
        </form>
    );
}