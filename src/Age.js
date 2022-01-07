import React, { useEffect } from 'react';
import { constrain, findTerm/*, r1d6, r2d6, randElt*/ } from './utils';
import { r1d6, r2d6, randElt } from './random';

import CECAREERS from './data/ce/careers';

export function Age({
    game,
    upp,
    updateUPP,
    age,
    updateAge,
    updateTerm,
    career,
    anagathics,
    mishap,
    updateCrisis,
    credits,
    updateCredits,
    display,
    onAged,
    onDeath,
    updateLog
}) {
    if (display && game === 'classic') {
        return (
            <AgeCT
                upp={upp}
                updateUPP={updateUPP}
                age={age}
                updateAge={updateAge}
                onAged={onAged}
                onDeath={onDeath}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <AgeCE
                upp={upp}
                updateUPP={updateUPP}
                age={age}
                updateAge={updateAge}
                career={career}
                anagathics={anagathics}
                mishap={mishap}
                updateCrisis={updateCrisis}
                credits={credits}
                updateCredits={updateCredits}
                onAged={onAged}
                onDeath={onDeath}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function AgeCT({ upp, updateUPP, age, updateAge, onAged, onDeath, updateLog }) {
    useEffect(() => {
        let curAge = age + 4;

        let newLog = [];

        // Began the aging process when the traveller reaches 34.
        if (curAge >= 34) {
            // Roll for each stat that can decrease with age.
            let strRoll, strDec, dexRoll, dexDec, endRoll, endDec, intRoll, intDec;
            let newUPP = {};

            if (curAge < 50) {
                strRoll = 8;
                strDec = -1;
                dexRoll = 7;
                dexDec = -1;
                endRoll = 8;
                endDec = -1;
                intRoll = 2;
                intDec = 0;
            } else if (curAge < 66) {
                strRoll = 9;
                strDec = -1;
                dexRoll = 8;
                dexDec = -1;
                endRoll = 9;
                endDec = -1;
                intRoll = 2;
                intDec = 0;
            } else {
                strRoll = 9;
                strDec = -2;
                dexRoll = 9;
                dexDec = -2;
                endRoll = 9;
                endDec = -2;
                intRoll = 9;
                intDec = -1;
            }

            if (r2d6() < strRoll) {
                newUPP.Strength = upp.Strength + strDec;
                newLog.push(`Your Strength decreased to ${newUPP.Strength}`);

                // Trigger an aging crisis if Strength falls to 0 or below.
                if (newUPP.Strength <= 0) {
                    if (r2d6() < 8) {
                        onDeath();
                    } else {
                        newLog.push('You have had an aging crisis!');
                        newUPP.Strength = 1;
                    }
                }
            }

            if (r2d6() < dexRoll) {
                newUPP.Dexterity = upp.Dexterity + dexDec;
                newLog.push(`Your Dexterity decreased to ${newUPP.Dexterity}`);

                // Trigger an aging crisis if Dexterity falls to 0 or below.
                if (newUPP.Dexterity <= 0) {
                    if (r2d6() < 8) {
                        onDeath();
                    } else {
                        newLog.push('You have had an aging crisis!');
                        newUPP.Dexterity = 1;
                    }
                }
            }

            if (r2d6() < endRoll) {
                newUPP.Endurance = upp.Endurance + endDec;
                newLog.push(`Your Endurance decreased to ${newUPP.Endurance}`);

                // Trigger an aging crisis if Endurance falls to 0 or below.
                if (newUPP.Endurance <= 0) {
                    if (r2d6() < 8) {
                        onDeath();
                    } else {
                        newLog.push('You have had an aging crisis!');
                        newUPP.Endurance = 1;
                    }
                }
            }

            if (r2d6() < intRoll) {
                newUPP.Intellect = upp.Intellect + intDec;
                newLog.push(`Your Intellect decreased to ${newUPP.Intellect}`);

                // Trigger an aging crisis if Intellect falls to 0 or below.
                if (newUPP.Intellect <= 0) {
                    if (r2d6() < 8) {
                        onDeath();
                    } else {
                        newLog.push('You have had an aging crisis!');
                        newUPP.Intellect = 1;
                    }
                }
            }

            updateUPP(newUPP);
        } else {
            newLog.push('You do not suffer the effects of aging.');
        }

        updateLog(newLog);
        updateAge(curAge);
        onAged();
    });

    return (<div></div>);
}

function AgeCE({
    upp,
    updateUPP,
    age,
    updateAge,
    career,
    anagathics,
    mishap,
    updateCrisis,
    credits,
    updateCredits,
    onAged,
    onDeath,
    updateLog
}) {
    useEffect(() => {
        const curCareer = career[career.length - 1]; // Get latest career
        const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];
        const physChars = ['Strength', 'Dexterity', 'Endurance'];
        const mentChars = ['Intellect', 'Education', 'Social'];

        let newLog = [];
        let agingCrisis = false;
        let dead = false;
        let debt = 0;
        let curAge = age;
        let newUPP = { ...upp };

        switch (mishap) {
            case 'HONORABLE-DISCHARGE':
            case 'DISHONORABLE-DISCHARGE':
            case 'MEDICAL-DISCHARGE':
                curAge += 2;
                break;
            case 'PRISON':
                curAge += 6; // Spend an additional four years in prison
                break;
            default: // No mishap
                curAge += 4;
                break;
        }

        // Began the aging process when the traveller reaches 34.
        if (curAge >= 34) {
            let numTerms = findTerm(curAge) - findTerm(age); // Find the number of terms that the character has aged.

            // Roll on the Aging table once for each four year term the character has aged
            for (let i = 0; i < numTerms; i++) {
                // Apply the total number of terms as a negative dice modifier 
                // and number of terms the traveller took anagathics as a positive dice modifier.
                let roll = constrain(r2d6() - (findTerm(age)+i+1) + anagathics.terms, -6, 12);

                switch (roll) {
                    case -6: {
                        newUPP.Strength -= 2;
                        newUPP.Dexterity -= 2;
                        newUPP.Endurance -= 2;
                        const mentChar = randElt(mentChars);
                        newUPP[mentChar] -= 1;
                        newLog.push(`Your physical stats have diminished by 2 and your ${mentChar} has diminished by 1.`);
                        break;
                    }
                    case -5:
                        newUPP.Strength -= 2;
                        newUPP.Dexterity -= 2;
                        newUPP.Endurance -= 2;
                        newLog.push('Your physical stats have diminished by 2.');
                        break;
                    case -4: {
                        const physChar = randElt(physChars);
                        const others = physChars.filter(elt => elt !== physChar);
                        newUPP[physChar] -= 1;
                        newLog.push(`Your ${physChar} has diminished by 1.`);
                        others.forEach(char => {
                            newUPP[char] -= 2;
                            newLog.push(`Your ${char} has diminished by 2.`);
                        });
                        break;
                    }
                    case -3: {
                        const physChar = randElt(physChars);
                        const others = physChars.filter(elt => elt !== physChar);
                        newUPP[physChar] -= 2;
                        newLog.push(`Your ${physChar} has diminished by 2.`);
                        others.forEach(char => {
                            newUPP[char] -= 1;
                            newLog.push(`Your ${char} has diminished by 1.`);
                        });
                        break;
                    }
                    case -2:
                        newUPP.Strength -= 1;
                        newUPP.Dexterity -= 1;
                        newUPP.Endurance -= 1;
                        newLog.push('Your physical stats have diminished by 1.');
                        break;
                    case -1: {
                        const physChar = randElt(physChars);
                        const others = physChars.filter(elt => elt !== physChar);
                        others.forEach(char => {
                            newUPP[char] -= 1;
                            newLog.push(`Your ${char} has diminished by 1.`);
                        });
                        break;
                    }
                    case 0: {
                        const physChar = randElt(physChars);
                        newUPP[physChar] -= 1;
                        newLog.push(`Your ${physChar} has diminished by 1.`);
                        break;
                    }
                    default:
                        newLog.push('You do not suffer the effects of aging.');
                        break; // No effect if roll > 0
                }
            }

            // Trigger an aging crisis if a physical characteristic has gone to or below 0 or the character just stopped taking anagathics.
            physChars.forEach(char => {
                if (newUPP[char] <= 0) {
                    agingCrisis = true;
                    newLog.push(`You have suffered an aging crisis. Your ${char} has been reduced to 0.`)
                    debt += r1d6() * 10000;
                }
            });
        } else {
            newLog.push('You do not suffer the effects of aging.')
        }

        if (agingCrisis) {
            // See if the traveller's employer will help pay for medical care.
            const medicalRoll = r2d6() + curCareer.rank;
            let payMod = 0;

            if (medicalRoll >= 12) {
                payMod = careerData.medical['12'];
            } else if (medicalRoll >= 8) {
                payMod = careerData.medical['8'];
            } else if (medicalRoll >= 4) {
                payMod = careerData.medical['4'];
            }

            newLog.push(`Your employer(s) pay for ${payMod * 100}% of your medical bills.`);
            debt = Math.round(debt * (1.0 - payMod));

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
        updateAge(curAge);
        updateCredits(-1 * debt);
        updateLog(newLog);

        if (!dead) {
            onAged();
        } else {
            onDeath();
        }
    });

    return (<div></div>);
}