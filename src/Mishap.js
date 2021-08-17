import React, { useEffect } from 'react';

import { r1d6 } from "./utils";

// import CECAREERS from './data/ce/careers';

export function Mishap({ game, upp, updateUPP, career, updateCareer, /*updateDebt,*/ updateCredits, updateInjury, /*updateMishap,*/ display, onMishap, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <MishapCE
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                updateCareer={updateCareer}
                // updateDebt={updateDebt}
                updateCredits={updateCredits}
                updateInjury={updateInjury}
                // updateMishap={updateMishap}
                onMishap={onMishap}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function MishapCE({ upp, updateUPP, career, updateCareer, /*updateDebt,*/ updateCredits, updateInjury, /*updateMishap,*/ onMishap, updateLog }) {
    // const curCareer = career[career.length - 1]; // Get latest career
    // const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];

    // function injury(val=0) {
    //     const physChars = ['Strength', 'Dexterity', 'Endurance'];
    //     let newUPP = { ...upp };

    //     if (val === 0) {
    //         val = r1d6();
    //     }

    //     switch (val) {
    //         case 1: {
    //             const physChar = randElt(physChars);
    //             const others = physChars.filter(elt => elt !== physChar);
    //             break;
    //         } case 2: {
    //             const physChar = randElt(physChars);
    //             newUPP[physChar] -= r1d6();
    //             updateLog(`You were severely injured. Your ${physChar} has been reduced to ${newUPP[physChar]}.`);
    //             break;
    //         } case 3: {
    //             const missing = randElt(['an eye', 'a limb']);
    //             const physChar = randElt(['Strength', 'Dexterity']);
    //             newUPP[physChar] -= 2;
    //             updateLog(`You lost ${missing}. Your ${physChar} has been reduced to ${newUPP[physChar]}.`);
    //             break;
    //         } case 4: {
    //             const physChar = randElt(physChars);
    //             newUPP[physChar] -= 2;
    //             updateLog(`You are scarred and injured. Your ${physChar} has been reduced to ${newUPP[physChar]}.`);
    //             break;
    //         } case 5: {
    //             const physChar = randElt(physChars);
    //             newUPP[physChar] -= 1;
    //             updateLog(`You are injured. Your ${physChar} has been reduced to ${newUPP[physChar]}.`);
    //             break;
    //         } case 6: {
    //             updateLog(`You were lightly injured.`);
    //             break;
    //         }
    //         default:
    //             throw new Error(`MishapCE Effect: rolled impossible number`);
    //     }

    //     updateUPP(newUPP);
    // }

    useEffect(() => {
        let newMishap = '';
        switch (r1d6()) {
            case 1:
                updateInjury(2);
                // updateMishap('MEDICAL-DISCHARGE');
                newMishap = 'MEDICAL-DISCHARGE';
                updateLog('You are injured in your career.');
                break;
            case 2:
                // updateMishap('HONORABLE-DISCHARGE');
                newMishap = 'HONORABLE-DISCHARGE';
                updateLog('You are honorably discharged from your career.');
                break;
            case 3:
                // updateMishap('HONORABLE-DISCHARGE');
                newMishap = 'HONORABLE-DISCHARGE';
                // updateDebt(10000);
                updateCredits(-10000);
                updateLog('You are honorably discharged from your career after a long legal battle.');
                break;
            case 4:
                // updateMishap('DISHONORABLE-DISCHARGE');
                newMishap = 'DISHONORABLE-DISCHARGE';
                updateLog('You are dishonorably discharged from your career. You lose all benefits.');
                break;
            case 5:
                // updateMishap('PRISON');
                newMishap = 'PRISON';
                updateLog('You are dishonorably discharged from your career. You lose all benefits and serve four years in prison.');
                break;
            case 6:
                // updateMishap('MEDICAL-DISCHARGE');
                newMishap = 'MEDICAL-DISCHARGE';
                updateInjury(-1);
                updateLog('You are medically discarged.');
                break;
            default:
                throw new Error(`MishapCE Effect: rolled impossible number`);
        }

        onMishap(newMishap); // Return the Mishap to APP because updateMishap() will not happen in time.
    });

    return (<div></div>);
}