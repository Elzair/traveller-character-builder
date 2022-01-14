// These components handle restoring characteristics to an injured traveller and calculating
// the cost of medical treatment.

import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';

import { r2d6 } from './random';

import CECAREERS from './data/ce/careers';

// Main Medical Component handles whether or not to display Medical (based on `display`)  
// and whether to use Cepheus Engine or Mongoose Traveller 2nd Edition.
export function Medical({ game, upp, updateUPP, career, injury, updateInjury, credits, updateCredits, display, onMedical, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <MedicalCE
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                injury={injury}
                updateInjury={updateInjury}
                credits={credits}
                updateCredits={updateCredits}
                onMedical={onMedical}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

// ..######..########.########..##.....##.########.##.....##..######.
// .##....##.##.......##.....##.##.....##.##.......##.....##.##....##
// .##.......##.......##.....##.##.....##.##.......##.....##.##......
// .##.......######...########..#########.######...##.....##..######.
// .##.......##.......##........##.....##.##.......##.....##.......##
// .##....##.##.......##........##.....##.##.......##.....##.##....##
// ..######..########.##........##.....##.########..#######...######.

function MedicalCE({ upp, updateUPP, career, injury, updateInjury, credits, updateCredits, onMedical, updateLog }) {
    let [checked, setChecked] = useState(true);
    let [debt, setDebt] = useState(0);

    function handleCheck(check) {
        setChecked(check);
    }

    function paymentDecision(ev) {
        ev.preventDefault();

        if (checked) {
            // Restore physical characteristics to their previous values
            const physChars = ['Strength', 'Dexterity', 'Endurance'];
            let newUPP = { ...upp };
            physChars.forEach(char => {
                newUPP[char] += (injury.injuries[char] || 0);
            });

            // Deduct debt from credits
            updateCredits(-1 * debt);
            setDebt(0);

            updateUPP(newUPP);
        }

        let newInjury = {
            roll: 0,
            crisis: injury.crisis,
            injuries: {},
        };

        updateInjury(newInjury);

        onMedical();
    }

    /**
     * This function calculates the cost of restoring the traveller's injured
     * characteristics after the traveller's employer has (potentially)
     * paid some of the expenses.
     * @returns Number representing the cost of the operation
     */
    function calculateDebt() {
        const curCareer = career[career.length - 1]; // Get latest career
        const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];

        // Calculate amount of credits needed to pay to restore all lost characteristics.
        let newDebt = 0;
        const physChars = ['Strength', 'Dexterity', 'Endurance'];
        physChars.forEach(char => newDebt += (injury.injuries[char] || 0));
        newDebt *= 5000; // Each characteristic point lost costs 5000Cr to treat.

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
        newDebt = Math.round(newDebt * (1.0 - payMod));

        return newDebt;
    }

    // If the traveller has no treatable injuries, go to the next step.
    useEffect(() => {
        if (Object.keys(injury.injuries).length === 0) {
            onMedical();
        } else {
            setDebt(calculateDebt());
        }
    });

    if (Object.keys(injury.injuries).length > 0) {
        // const cost = calculateDebt(); // Calculate debt for display purposes.

        return (
            <form onSubmit={paymentDecision} className="Medical">
                <p>It will cost {debt}Cr to restore your physical characteristics? Do you pay?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
        );
    } else {
        return (<div></div>);
    }
}