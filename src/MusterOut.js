import { useState } from 'react';

import { r1d6 } from './utils';

import CTCAREERS from './data/ct/careers';
import CTITEMS from './data/ct/items';

export function MusterOut({ game, upp, updateUPP, career, skills, updateSkills, credits, updateCredits, items, updateItems, display, onMusterOut, updateLog }) {
    if (display && game === 'classic') {
        return (
            <MusterOutCT
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                skills={skills}
                updateSkills={updateSkills}
                credits={credits}
                updateCredits={updateCredits}
                items={items}
                updateItems={updateItems}
                onMusterOut={onMusterOut}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function MusterOutCT({ upp, updateUPP, career, skills, updateSkills, credits, updateCredits, items, updateItems, onMusterOut, updateLog }) {
    const MAXCASHROLLS = 3;

    let [numCashRolls, setNumCashRolls] = useState(MAXCASHROLLS);
    let [weapon, setWeapon] = useState(null);
    let [numBenefitRolls, setNumBenefitRolls] = useState(99); // Use some large number first.

    function decreaseBenefits() {
        const curNumBenefitRolls = numBenefitRolls;
        setNumBenefitRolls(numBenefitRolls-1);
        if (curNumBenefitRolls === 1) {
            onMusterOut();
        }
    }

    function handleBenefitSelection(ev) {
        ev.preventDefault();
        for (let t of ev.target) {
            if (t.checked) {
                const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
                const table = careerData[t.value];

                if (t.value === 'cash') {
                    // Give travellers with Gambling-1 or higher a +1 DM on rolls on the Cash table.
                    const cashDM = skills.hasOwnProperty('Gambling') && skills.Gambling >= 1 ? 1 : 0;
                    const amount = table[r1d6() - 1 + cashDM];
                    updateLog([`You receive Cr${amount}.`]);
                    updateCredits(credits + amount);
                    setNumCashRolls(numCashRolls - 1);
                    decreaseBenefits();
                    // onBenefit();
                } else if (t.value === 'benefits') {
                    // Give travellers of rank 5 or rank 6 a +1 DM on rolls on the benefits table.
                    const benefitsDM = career.rank >= 5 ? 1 : 0;
                    const benefit = table[Math.min(r1d6() - 1 + benefitsDM, table.length - 1)]; // Cap roll because not every benefit table has enough values.
                    // console.log(benefit);
                    if (benefit.type === 'WEAPON') {
                        // If the benefit is a weapon, and the traveller has already received one, then
                        // ask if the traveller would like a skill increase instead.
                        setWeapon(benefit);
                        // onWeapon();
                    } else if (benefit.type === 'ITEM') {
                        updateLog([`You received a ${benefit.name}.`]);
                        let newItems = {};
                        newItems[benefit.name] = 1;
                        updateItems(newItems);
                        decreaseBenefits();
                        // onBenefit();
                    } else if (benefit.type === 'CHARACTERISTIC') {
                        let newUPP = {};
                        newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        updateLog([`You raised your ${benefit.name} to ${newUPP[benefit.name]}.`]);
                        updateUPP(newUPP);
                        decreaseBenefits();
                        // onBenefit();
                    }
                }
            }
        }
    }

    function handleWeaponSelection(ev) {
        ev.preventDefault();
        for (let t of ev.target) {
            if (t.checked) {
                // Check if the selected value is a specific weapon or a category of weapons
                // TODO: Improve this
                if (CTITEMS.hasOwnProperty(t.value)) {
                    setWeapon({name: t.value});
                } else {
                    updateLog([`You received a weapon ${t.value}.`]);
                    let newItems = {};
                    newItems[t.value] = 1;
                    updateItems(newItems);
                    decreaseBenefits();
                    setWeapon(null);
                }
            }
        }
    }

    // Set the number of benefit rolls if it has not already been set.
    // Travellers get one benefit roll for each term they serve plus the following:
    // Ranks 1&2 1
    // Ranks 3&4 2
    // Ranks 5&6 3
    if (numBenefitRolls === 99) {
        let benefitRollMod = 0;
        switch (career.rank) {
            case 0: break;
            case 1: 
            case 2: benefitRollMod = 1;
                    break;
            case 3: 
            case 4: benefitRollMod = 2;
                    break;
            case 5: 
            case 6: benefitRollMod = 3;
                    break;
            default: throw new Error(`career rank ${career.rank} is not in range 0-6!`); 
        }

        setNumBenefitRolls(career.term + benefitRollMod);
    }

    if (weapon === null) {
        // Add cash option only if traveller has not already rolled three times on the cash table.
        let options = {
            "benefits": "Benefits",
        };
        if (numCashRolls > 0) {
            options["cash"] = "Cash";
        }
        const optionElts = Object.keys(options).map(prop => (
            <label>
                <input type="radio" id={prop} name="musterout" value={prop} />
                {options[prop]}
            </label>
        ));

        return (
            <div className="MusterOut">
                <form onSubmit={handleBenefitSelection}>
                    <label>Choose either Cash or Benefits:</label>
                    {optionElts}
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    } else if (weapon && weapon.hasOwnProperty('name') /*&& (weapon.name === 'Blade' || weapon.name === 'Gun')*/) { // Handle cascading weapon selection
        const itemData = CTITEMS[weapon.name];
        const optionElts = Object.keys(itemData).map(item => (
            <label>
                <input type="radio" id={item} name="weapons" value={item} />
                {item}
            </label>
        ));

        return (
            <div>
                {<form onSubmit={handleWeaponSelection}>
                    <label>{`Choose a specific ${weapon.name}:`}</label>
                    {optionElts}
                    <input type="submit" value="Submit" />
                </form>}
            </div>
        );
    } else {
        return (<div></div>);
    }
}