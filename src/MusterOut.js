import { useState } from 'react';

import { r1d6 } from './utils';

import CTCAREERS from './data/ct/careers';
import CTITEMS from './data/ct/items';

export function MusterOut({ game, upp, updateUPP, career, skills, updateSkills, credits, updateCredits, items, updateItems, display, onBenefit/*, onWeapon*/, updateLog }) {
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
                onBenefit={onBenefit}
                //onWeapon={onWeapon}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function MusterOutCT({ upp, updateUPP, career, skills, updateSkills, credits, updateCredits, items, updateItems, onBenefit/*, onWeapon*/, updateLog }) {
    const MAXCASHROLLS = 3;

    let [numCashRolls, setNumCashRolls] = useState(MAXCASHROLLS);
    let [weapon, setWeapon] = useState(null);

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
                    updateCredits(credits + amount);
                    setNumCashRolls(numCashRolls - 1);
                    updateLog([`You receive Cr${amount}.`]);
                    onBenefit();
                } else if (t.value === 'benefits') {
                    // Give travellers of rank 5 or rank 6 a +1 DM on rolls on the benefits table.
                    const benefitsDM = career.rank >= 5 ? 1 : 0;
                    const benefit = table[Math.min(r1d6() - 1 + benefitsDM, table.length - 1)]; // Cap roll because not every benefit table has enough values.
                    console.log(benefit);
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
                        onBenefit();
                    } else if (benefit.type === 'CHARACTERISTIC') {
                        let newUPP = {};
                        newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        updateLog([`You raised your ${benefit.name} to ${newUPP[benefit.name]}.`]);
                        updateUPP(newUPP);
                        onBenefit();
                    }
                }
            }
        }
    }

    function handleWeaponSelection(ev) {
        ev.preventDefault();
        for (let t of ev.target) {
            if (t.checked) {
                updateLog([`You received a weapon ${t.value}.`]);
                let newItems = {};
                newItems[t.value] = 1;
                updateItems(newItems);
                setWeapon(null);
            }
        }
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
    } else if (weapon && weapon.hasOwnProperty('name') && (weapon.name === 'Blade' || weapon.name === 'Gun')) {
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