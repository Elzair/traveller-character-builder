import React, { useState } from 'react';
import Switch from 'react-switch';

export function NewCareer({ game, career, updateCareer, crisis, display, onSelection, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <NewCareerCE
                career={career}
                updateCareer={updateCareer}
                crisis={crisis}
                onSelection={onSelection}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function NewCareerCE({ career, updateCareer, crisis, onSelection, updateLog }) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {
        setChecked(check);
    }

    function handleDrifter(ev) {
        ev.preventDefault();

        if (checked) {
            // Travellers do not get any benefits for becoming a drifter.
            let newCareer = [...career];
            newCareer.push({
                branch: 'drifter',
                term: 0,
                rank: 0,
                drafted: false,
                rankPrev: 0
            });
            updateCareer(newCareer);

            updateLog(['You have decided to become a Drifter!']);

            onSelection(true, true);
        } else {
            updateLog(['You have decided to become a traveller!']);

            onSelection(false, true);
        }
    }

    function handleNewCareer(ev) {
        ev.preventDefault();

        updateLog([checked ? 'You have decided to try a new career!' : 'You have decided to become a traveller!']);

        onSelection(checked, false);
    }

    // Travellers who have suffered an Aging or Injury Crisis can only choose the Drifter career.
    if (crisis) {
        return (
            <form onSubmit={handleDrifter} className="NewCareer">
                <p>Would you like to become a Drifter?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
        );
    } else {
        return (
            <form onSubmit={handleNewCareer} className="NewCareer">
                <p>Would you like to start a new career?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
        );
    }
}