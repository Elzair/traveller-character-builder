import React, { useState } from 'react';
import Switch from 'react-switch';

// import { r2d6 } from "./utils";

import CECAREERS from './data/ce/careers';

export function Anagathics({ game, anagathics, updateAnagathics, display, onAnagathicsDecision, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <AnagathicsCE
                anagathics={anagathics}
                updateAnagathics={updateAnagathics}
                onAnagathicsDecision={onAnagathicsDecision}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function AnagathicsCE({ anagathics, updateAnagathics, onAnagathicsDecision, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {
        setChecked(check);
    }

    function decision(ev) {
        ev.preventDefault();
        const input = ev.target[0];

        if (checked) {
            updateLog(`You decided to take Anagathics for this term.`);
            updateAnagathics(true);
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