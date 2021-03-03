import { useState } from 'react';

import { r1d6 } from './utils';

import CTCAREERS from './data/ct/careers';

export function MusterOut({ game, upp, updateUPP, career, skills, updateSkills, credits, updateCredits, items, updateItems, display, onExit, updateLog }) {
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
                onExit={onExit}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function MusterOutCT({ upp, updateUPP, career, skills, updateSkills, credits, updateCredits, items, updateItems, onExit, updateLog }) {
    const MAXCASHROLLS = 3;

    let [numCashRolls, setNumCashRolls] = useState(MAXCASHROLLS);

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
                    setNumCashRolls(numCashRolls-1);
                    updateLog(`You receive Cr${amount}.`);
                } else if (t.value === 'benefits') {
                    // Give travellers of rank 5 or rank 6 a +1 DM on rolls on the benefits table.
                    const benefitsDM = career.rank >= 5 ? 1 : 0;
                    const benefit = table[Math.min(r1d6() - 1 + benefitsDM, table.length-1)];

                    if (benefit.type === 'ITEM') {
                        // If the benefit is a weapon, and the traveller has already received one, then
                        // ask if the traveller would like a skill increase instead.
                        // if (items.hasOwnProperty(benefit.name) && benefit.hasOwnProperty('altSkill')) {
                        //     console.log('Got here.')
                        // } else {}
                        let newItems = {};
                        newItems[benefit.name] = 1;
                        updateItems(newItems);
                        updateLog([`You received a ${benefit.name}.`]);
                    } else if (benefit.type === 'CHARACTERISTIC') {
                        let newUPP = {};
                        newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                        updateUPP(newUPP);
                        updateLog([`You raised your ${benefit.name} to ${newUPP[benefit.name]}.`]);
                    }
                }
            }
        }
    }

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
}