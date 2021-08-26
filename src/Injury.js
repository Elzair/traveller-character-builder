import React, { useEffect } from 'react';

import { r1d6, r2d6, randElt } from "./utils";

import CECAREERS from './data/ce/careers';

export function Injury({ game, upp, updateUPP, career, injury, updateInjury, updateCrisis, credits, updateCredits, display, onInjury, onDeath, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <InjuryCE
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                injury={injury}
                updateInjury={updateInjury}
                updateCrisis={updateCrisis}
                credits={credits}
                updateCredits={updateCredits}
                onInjury={onInjury}
                onDeath={onDeath}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function InjuryCE({ upp, updateUPP, career, injury, updateInjury, updateCrisis, credits, updateCredits, onInjury, onDeath, updateLog }) {
    useEffect(() => {
        const curCareer = career[career.length - 1]; // Get latest career
        const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];

        const physChars = ['Strength', 'Dexterity', 'Endurance'];
        let newUPP = { ...upp };
        let newCrisis = false;
        let newLog = [];
        let debt = 0;
        let dead = false;
        let newInjury = { ...injury };

        if (newInjury.roll === -1) {
            newInjury.roll = r1d6();
        }

        switch (newInjury.roll) {
            case 1: {
                const physChar = randElt(physChars);
                const others = physChars.filter(elt => elt !== physChar);
                const dec = r1d6();
                newUPP[physChar] -= dec;
                newInjury.injuries[physChar] = dec;
                others.forEach(char => {
                    newUPP[char] -= 2;
                    newInjury.injuries[char] = 2;
                });
                newLog.push(`You were nearly killed. Your ${physChar} has been reduced by ${dec} and your other physical characteristics were reduced by 2.`);
                break;
            } case 2: {
                const physChar = randElt(physChars);
                const dec = r1d6();
                newUPP[physChar] -= dec;
                newInjury.injuries[physChar] = dec;
                newLog.push(`You were severely injured. Your ${physChar} has been reduced by ${dec}.`);
                break;
            } case 3: {
                const missing = randElt(['an eye', 'a limb']);
                const physChar = randElt(['Strength', 'Dexterity']);
                newUPP[physChar] -= 2;
                newInjury.injuries[physChar] = 2;
                newLog.push(`You lost ${missing}. Your ${physChar} has been reduced by 2.`);
                break;
            } case 4: {
                const physChar = randElt(physChars);
                newUPP[physChar] -= 2;
                newInjury.injuries[physChar] = 2;
                newLog.push(`You are scarred and injured. Your ${physChar} has been reduced by 2.`);
                break;
            } case 5: {
                const physChar = randElt(physChars);
                newUPP[physChar] -= 1;
                newInjury.injuries[physChar] = 1;
                newLog.push(`You are injured. Your ${physChar} has been reduced by 1.`);
                break;
            } case 6: {
                newLog.push(`You were lightly injured.`);
                break;
            }
            default:
                throw new Error(`InjuryCE Effect: rolled impossible number: ${newInjury.roll}`);
        }

        // Trigger an injury crisis if a physical characteristic has gone to or below 0.
        physChars.forEach(char => {
            if (newUPP[char] <= 0) {
                newCrisis = true;
                newLog.push(`You have suffered an injury crisis. Your ${char} has been reduced to 0.`)
                debt += r1d6() * 10000;
            }
        });

        // See if the traveller's employer will help pay for medical care.
        if (debt > 0) {
            const medicalRoll = r2d6() + curCareer.rank;
            let payMod = 0;

            if (medicalRoll >= 12) {
                payMod = careerData.medical['12'];
            } else if (medicalRoll >= 8) {
                payMod = careerData.medical['8'];
            } else if (medicalRoll >= 4) {
                payMod = careerData.medical['4'];
            }

            newLog.push(`Your employer(s) pay for ${payMod*100}% of your medical bills.`);
            debt = Math.round(debt * (1.0 - payMod));
        }

        if (newCrisis) {
            // The traveller dies unless they can IMMEDIATELY pay for medical care.
            if (debt > credits) {
                newLog.push('You could not pay for emergency medical care. You have died.');
                
                dead = true;
            } else {
                // If the traveller could pay for medical care, set any physical characteristics
                // at or below 0 to 1.
                physChars.forEach(char => {
                    if (newUPP[char] <= 0) {
                        newUPP[char] = 1;
                    }
                });

                updateCrisis(true);
            }
        }

        updateUPP(newUPP);
        updateCredits(-1 * debt);
        updateInjury(newInjury);

        updateLog(newLog);

        if (!dead) {
            onInjury();
        } else {
            onDeath();
        }
    });

    return (<div></div>)
}


