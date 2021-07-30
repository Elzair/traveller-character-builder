import React, { useEffect } from 'react';

import { applyDMsToRoll, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

export function Survival({ game, upp, career, updateCareer, display, onSurvival, onDeath }) {
    if (display && game === 'classic') {
        return (
            <SurvivalCT
                game={game}
                upp={upp}
                career={career}
                updateCareer={updateCareer}
                onSurvival={onSurvival}
                onDeath={onDeath}
            />
        );
    } else {
        return (<div></div>);
    }
}

function SurvivalCT({ upp, career, updateCareer, onSurvival, onDeath }) {
    const curCareer = career[career.length - 1]; // Get latest career
    const careerData = CTCAREERS.filter(c => c.name === curCareer.branch)[0];

    let roll = r2d6();

    if (careerData.survival.hasOwnProperty('dms')) {
        roll = applyDMsToRoll(r2d6(), careerData.survival.dms, upp, curCareer.term); // Belter's survival odds go up with each term they have.
    }

    const didSurvive = roll >= careerData.survival.target;

    if (didSurvive) {
        useEffect(() => {
            // Increase career `term`
            let term = career[career.length - 1].term + 1;
            // console.log(`Term: ${term}`);
            let newCareer = [...career];
            newCareer[newCareer.length - 1].term = term;
            updateCareer(newCareer);

            onSurvival();
        });

        // onSurvival();
    } else {
        onDeath();
    }

    return (<div></div>)
}



