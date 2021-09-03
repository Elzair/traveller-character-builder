import React, { useEffect } from 'react';

import { r1d6 } from "./utils";

// import CECAREERS from './data/ce/careers';

export function Mishap({ 
    game, 
    upp, 
    updateUPP, 
    career, 
    updateCareer, 
    updateCredits, 
    injury, 
    updateInjury, 
    updateMishap, 
    display, 
    onMishap, 
    updateLog 
}) {
    if (display && game === 'cepheusengine') {
        return (
            <MishapCE
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                updateCareer={updateCareer}
                updateCredits={updateCredits}
                injury={injury}
                updateInjury={updateInjury}
                updateMishap={updateMishap}
                onMishap={onMishap}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function MishapCE({ upp, updateUPP, career, updateCareer, updateCredits, injury, updateInjury, updateMishap, onMishap, updateLog }) {
    useEffect(() => {
        let newInjury = {
            roll: 0,
            crisis: injury.crisis,
            injuries: {}
        };
        let newMishap = '';
        let newLog = [];

        switch (r1d6()) {
            case 1:
                newInjury.roll = 2;
                newMishap = 'MEDICAL-DISCHARGE';
                newLog.push('You are injured in your career.');
                break;
            case 2:
                newMishap = 'HONORABLE-DISCHARGE';
                newLog.push('You are honorably discharged from your career.');
                break;
            case 3:
                newMishap = 'HONORABLE-DISCHARGE';
                updateCredits(-10000);
                newLog.push('You are honorably discharged from your career after a long legal battle.');
                break;
            case 4:
                newMishap = 'DISHONORABLE-DISCHARGE';
                newLog.push('You are dishonorably discharged from your career. You lose all benefits.');
                break;
            case 5:
                newMishap = 'PRISON';
                newLog.push('You are dishonorably discharged from your career. You lose all benefits and serve four years in prison.');
                break;
            case 6:
                newMishap = 'MEDICAL-DISCHARGE';
                newInjury.roll = -1; // Set this to -1 to have Injury roll for the injury
                newLog.push('You are medically discarged.');
                break;
            default:
                throw new Error(`MishapCE Effect: rolled impossible number`);
        }

        updateMishap(newMishap);
        updateInjury(newInjury);
        updateLog(newLog);

        onMishap(newMishap); // Return the `mishap` to `App` because `updateMishap()` will not happen in time.
    });

    return (<div></div>);
}