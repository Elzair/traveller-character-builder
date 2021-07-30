import React from 'react';
import { r2d6 } from './utils';

export function Age({ game, upp, updateUPP, age, updateAge, display, onAged, onDeath, updateLog }) {
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
    } else {
        return (<div></div>);
    }
}

function AgeCT({ upp, updateUPP, age, updateAge, onAged, onDeath, updateLog }) {
    let curAge = age+4;

    let newLog= [];

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
    }

    updateLog(newLog);
    updateAge(age+4);
    onAged();

    return (<div></div>);
}