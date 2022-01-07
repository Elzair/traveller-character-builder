import React, { useEffect } from 'react';

import { applyDMsToRoll, modRollCE/*, r2d6*/ } from './utils';
import { r2d6 } from './random';

import CTCAREERS from './data/ct/careers';
import CECAREERS from './data/ce/careers';

export function Survival({ game, options, upp, career, updateCareer, anagathics, display, onSurvival, onMishap, onDeath, updateLog }) {
    if (display && game === 'classic') {
        return (
            <SurvivalCT
                upp={upp}
                career={career}
                updateCareer={updateCareer}
                onSurvival={onSurvival}
                onDeath={onDeath}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <SurvivalCE
                options={options}
                upp={upp}
                career={career}
                updateCareer={updateCareer}
                anagathics={anagathics}
                onSurvival={onSurvival}
                onMishap={onMishap}
                onDeath={onDeath}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function SurvivalCT({ upp, career, updateCareer, onSurvival, onDeath }) {
    useEffect(() => {
        const curCareer = career[career.length - 1]; // Get latest career
        const careerData = CTCAREERS.filter(c => c.name === curCareer.branch)[0];

        let roll = r2d6();

        if (careerData.survival.hasOwnProperty('dms')) {
            roll = applyDMsToRoll(r2d6(), careerData.survival.dms, upp, curCareer.term); // Belter's survival odds go up with each term they serve.
        }

        const didSurvive = roll >= careerData.survival.target;

        if (didSurvive) {
            // Increase career `term`
            let term = career[career.length - 1].term + 1;
            let newCareer = [...career];
            newCareer[newCareer.length - 1].term = term;
            updateCareer(newCareer);

            onSurvival();
        } else {
            onDeath();
        }
    });

    return (<div></div>)
}

function SurvivalCE({ options, upp, career, updateCareer, anagathics, onSurvival, onMishap, onDeath, updateLog }) {
    useEffect(() => {
        const curCareer = career[career.length - 1]; // Get latest career
        const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];

        let roll = modRollCE(upp, careerData.survival.characteristic, true);
        let didSurvive = roll >= careerData.survival.target && roll !== 2;

        // Travellers taking anagathics need to make two survival rolls.
        if (anagathics.current) {
            roll = modRollCE(upp, careerData.survival.characteristic, true);
            didSurvive = roll >= careerData.survival.target && roll !== 2;
        }

        if (didSurvive) {
            // Increase career `term`
            let term = career[career.length - 1].term + 1;
            let newCareer = [...career];
            newCareer[newCareer.length - 1].term = term;
            updateCareer(newCareer);

            updateLog('You survived another term.');
            onSurvival();
        } else {
            // RAW: If a traveller is taking anagathics, if EITHER survival roll fails, the traveller has a mishap and is ejected from the career rather than dying.
            if (options.mishap || anagathics.current) {
                updateLog('You had a mishap.');
                onMishap();
            } else {
                updateLog('You died.');
                onDeath();
            }
        }
    });

    return (<div></div>);
}


