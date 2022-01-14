// These components handle selecting benefits from leaving a career.

import React from 'react';
import { useState } from 'react';
import Switch from 'react-switch';

import { r1d6 } from './random';

import CTCAREERS from './data/ct/careers';
import CTITEMS from './data/ct/items';
import CECAREERS from './data/ce/careers';
import CEITEMS from './data/ce/items';


const INITBENEFITROLLS = 99; // Use some large number first

// Main MusterOut Component handles whether or not to display MusterOut (based on `display`)  
// and whether to use Classic Traveller, Cepheus Engine, or Mongoose Traveller 2nd Edition.
export function MusterOut({ 
    game, 
    upp, 
    updateUPP, 
    career, 
    skills, 
    updateSkills,
    numCashRolls,
    decrementNumCashRolls, 
    updateCredits, 
    items, 
    updateItems, 
    modifyItems,
    display, 
    onMusterOut, 
    updateLog 
}) {
    if (display && game === 'classic') {
        return (
            <MusterOutCT
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                skills={skills}
                updateSkills={updateSkills}
                numCashRolls={numCashRolls}
                decrementNumCashRolls={decrementNumCashRolls}
                updateCredits={updateCredits}
                items={items}
                updateItems={updateItems}
                modifyItems={modifyItems}
                onMusterOut={onMusterOut}
                updateLog={updateLog}
            />
        );
    } else if (display && game === 'cepheusengine') {
        return (
            <MusterOutCE
                upp={upp}
                updateUPP={updateUPP}
                career={career}
                skills={skills}
                updateSkills={updateSkills}
                numCashRolls={numCashRolls}
                decrementNumCashRolls={decrementNumCashRolls}
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

// ..######..##..........###.....######...######..####..######.
// .##....##.##.........##.##...##....##.##....##..##..##....##
// .##.......##........##...##..##.......##........##..##......
// .##.......##.......##.....##..######...######...##..##......
// .##.......##.......#########.......##.......##..##..##......
// .##....##.##.......##.....##.##....##.##....##..##..##....##
// ..######..########.##.....##..######...######..####..######.

function MusterOutCT({ 
    upp, 
    updateUPP, 
    career, 
    skills, 
    updateSkills,
    numCashRolls,
    decrementNumCashRolls, 
    updateCredits, 
    items, 
    updateItems, 
    modifyItems, 
    onMusterOut, 
    updateLog 
}) {
    // const MAXCASHROLLS = 3;

    // let [numCashRolls, setNumCashRolls] = useState(MAXCASHROLLS);
    let [weapon, setWeapon] = useState(null);
    let [skill, setSkill] = useState(null);
    let [skillChecked, setSkillChecked] = useState(true);
    let [numBenefitRolls, setNumBenefitRolls] = useState(INITBENEFITROLLS); // Use some large number first.

    function decreaseBenefits() {
        const curNumBenefitRolls = numBenefitRolls - 1;
        setNumBenefitRolls(curNumBenefitRolls);

        if (curNumBenefitRolls === 0) {
            numBenefitRolls = INITBENEFITROLLS;

            onMusterOut();
        }
    }

    function handleBenefitSelection(ev) {
        ev.preventDefault();

        let val = '';
        for (let t of ev.target) {
            if (t.checked) {
                val = t.value;
            }
        }

        const curCareer = career[career.length-1]; // Get latest career
        const careerData = CTCAREERS.filter(c => c.name === curCareer.branch)[0];
        const table = careerData[val];

        if (val === 'cash') { // Handle the traveller selecting cash as a benefit.
            // Give travellers with Gambling-1 or higher a +1 DM on rolls on the Cash table.
            const cashDM = skills.hasOwnProperty('Gambling') && skills.Gambling >= 1 ? 1 : 0;
            const amount = table[r1d6() - 1 + cashDM];
            updateCredits(amount);

            updateLog([`You receive Cr${amount}.`]);

            // setNumCashRolls(numCashRolls - 1);
            decrementNumCashRolls();
            decreaseBenefits();
        } else if (val === 'benefits') { // Handle the traveller selecting a specific benefit.
            // Give travellers of rank 5 or rank 6 a +1 DM on rolls on the benefits table.
            const benefitsDM = curCareer.rank >= 5 ? 1 : 0;
            const benefit = table[Math.min(r1d6() - 1 + benefitsDM, table.length - 1)]; // Cap roll because not every benefit table has enough values.

            if (benefit.type === 'WEAPON') {
                // If the benefit is a weapon, and the traveller has already received one, then
                // ask if the traveller would like a skill increase instead.
                setWeapon(benefit);
            } else if (benefit.type === 'ITEM') {
                const newItems = { [benefit.name]: 1};
                updateItems(newItems);

                updateLog([`You received a ${benefit.name}.`]);

                decreaseBenefits();
            } else if (benefit.type === 'CHARACTERISTIC') {
                let newUPP = {};
                newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                updateUPP(newUPP);

                updateLog([`You raised your ${benefit.name} to ${newUPP[benefit.name]}.`]);

                decreaseBenefits();
            } else if (benefit.type === 'SHIP') {
                // If the traveller has received a ship with a lease
                if (benefit.hasOwnProperty('lease') && benefit.hasOwnProperty('reduction')) {
                    let newItems = { ...items }

                    // If the traveller already has received the leased ship as a benefit
                    if (newItems.hasOwnProperty(benefit.name)) {
                        // If the traveller already has a paid-up ship, they get nothing.
                        if (typeof newItems[benefit.name] === 'number') {
                            updateLog([`You would have received a ${benefit.name}, but you already had one.`]);
                        } else if (typeof newItems[benefit.name] === 'object' && newItems[benefit.name] !== null) {
                            // Reduce the time of `lease` by `benefit.reduction` every time the traveller receives this benefit.
                            const lease = newItems[benefit.name].lease - benefit.reduction;

                            if (lease <= 0) { // The lease is paid off
                                newItems[benefit.name] = 1;

                                updateLog([`Your ${benefit.name} is now fully paid for!`]);
                            } else {
                                newItems[benefit.name] = { lease };

                                updateLog([`You pay off ${benefit.reduction} years of your ${benefit.lease} year lease on the ${benefit.name}.`]);
                            }
                        }
                    } else {
                        newItems[benefit.name] = { lease: benefit.lease };

                        updateLog([`You receive a ${benefit.name} with a ${benefit.lease} year lease.`]);
                    }

                    modifyItems(newItems);
                } else {
                    if (items.hasOwnProperty(benefit.name)) {
                        updateLog([`You would have received a ${benefit.name}, but you already had one.`]);
                    } else {
                        const newItems = { [benefit.name]: 1 };
                        updateItems(newItems);

                        updateLog([`You receive a ${benefit.name}.`]);
                    }
                }
                
                decreaseBenefits();
            } else if (benefit.type === 'SPECIAL') {
                if (items.hasOwnProperty(benefit.name)) {
                    updateLog([`You receive ${benefit.name}, but you already have it.`]);
                } else {
                    const newItems = { [benefit.name]: 1 };
                    updateItems(newItems);

                    updateLog([`You receive ${benefit.name}.`]);
                }

                decreaseBenefits();
            } else if (benefit.type === 'NOTHING') {
                updateLog(['You do not receive anything of note.']);

                decreaseBenefits();
            }
        }
    }

    function handleWeaponSelection(ev) {
        ev.preventDefault();

        let weapon = '';
        for (let t of ev.target) {
            if (t.checked) {
                weapon = t.value;
            }
        }

        // Check if the selected value is a specific weapon or a category of weapons
        // TODO: Improve this
        if (CTITEMS.hasOwnProperty(weapon)) {
            setWeapon({ name: weapon });
        } else if (items.hasOwnProperty(weapon) && items[weapon] > 0) {
            // If the traveller already has taken that weapon as a benefit, offer them
            // an increase in the corresponding skill instead.
            setSkill(weapon);
            setWeapon(null);
        }
        else {
            let newItems = {};
            newItems[weapon] = 1;
            updateItems(newItems);

            updateLog([`You received a weapon ${weapon}.`]);

            decreaseBenefits();
            setWeapon(null);
        }
    }

    function handleCheck(check) {
        setSkillChecked(check);
    }

    function handleSkillOrWeapon(ev) {
        ev.preventDefault();

        const input = ev.target[0];
        if (input.checked) {
            let newSkill = {};
            if (!skills.hasOwnProperty(skill)) {
                newSkill[skill] = 1;
            } else {
                newSkill[skill] = skills[skill] + 1;
            }
            
            updateSkills(newSkill);

            updateLog([`You improved your ${skill} to ${newSkill[skill]}.`]);
        } else {
            let newItems = {};
            newItems[skill] = 1;
            updateItems(newItems);

            updateLog([`You received a weapon ${skill}.`]);
        }

        decreaseBenefits();
        setSkill(null);
    }

    // Set the number of benefit rolls if it has not already been set.
    // Travellers get one benefit roll for each term they serve plus the following:
    // Ranks 1&2 1
    // Ranks 3&4 2
    // Ranks 5&6 3
    if (numBenefitRolls === INITBENEFITROLLS) {
        const curCareer = career[career.length-1]; // Get latest career
        let benefitRollMod = 0;
        
        switch (curCareer.rank) {
            case 0: 
                break;
            case 1:
            case 2: 
                benefitRollMod = 1;
                break;
            case 3:
            case 4: 
                benefitRollMod = 2;
                break;
            case 5:
            case 6: benefitRollMod = 3;
                break;
            default: throw new Error(`career rank ${curCareer.rank} is not in range 0-6!`);
        }

        setNumBenefitRolls(curCareer.term + benefitRollMod);
    }

    if (weapon === null && skill === null) {
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
    } else if (weapon && weapon.hasOwnProperty('name')) { // Handle cascading weapon selection
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
    } else if (skill) { // Handle skill increase with an already selected weapon
        return (
            <form onSubmit={handleSkillOrWeapon} className="SkillOrWeapon">
                <p>You already have that weapon. Would you like an increase in that skill instead?</p>
                <Switch checked={skillChecked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
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

function MusterOutCE({ 
    upp, 
    updateUPP, 
    career, 
    skills, 
    updateSkills,
    numCashRolls, 
    decrementNumCashRolls,
    updateCredits, 
    items, 
    updateItems, 
    onMusterOut, 
    updateLog 
}) {
    // const MAXCASHROLLS = 3;

    // let [numCashRolls, setNumCashRolls] = useState(MAXCASHROLLS);
    let [weapon, setWeapon] = useState(null);
    let [skill, setSkill] = useState(null);
    let [skillChecked, setSkillChecked] = useState(true);
    let [numBenefitRolls, setNumBenefitRolls] = useState(INITBENEFITROLLS); // Use some large number first.

    function decreaseBenefits() {
        const curNumBenefitRolls = numBenefitRolls - 1;
        setNumBenefitRolls(curNumBenefitRolls);

        if (curNumBenefitRolls === 0) {
            numBenefitRolls = INITBENEFITROLLS;

            onMusterOut();
        }
    }

    function handleBenefitSelection(ev) {
        ev.preventDefault();

        let val = '';
        for (let t of ev.target) {
            if (t.checked) {
                val = t.value;
            }
        }

        const curCareer = career[career.length-1]; // Get latest career
        const careerData = CECAREERS.filter(c => c.name === curCareer.branch)[0];
        const table = careerData[val];

        if (val === 'cash') {
            // Give travellers who either have retired or have the Gambling skill a +1 DM on rolls on the Cash table.
            const cashDM = ((skills.hasOwnProperty('Gambling') && skills.Gambling >= 1) || (curCareer.retired)) ? 1 : 0;
            const amount = table[r1d6() - 1 + cashDM];
            updateCredits(amount);

            updateLog([`You receive Cr${amount}.`]);

            // setNumCashRolls(numCashRolls - 1);
            decrementNumCashRolls();
            decreaseBenefits();
        } else if (val === 'benefits') {
            // Give travellers of rank 5 or rank 6 a +1 DM on rolls on the benefits table.
            const benefitsDM = curCareer.rank >= 5 ? 1 : 0;
            const benefit = table[Math.min(r1d6() - 1 + benefitsDM, table.length - 1)]; // Cap roll because not every benefit table has enough values.

            if (benefit.type === 'WEAPON') {
                // If the benefit is a weapon, and the traveller has already received one, then
                // ask if the traveller would like a skill increase instead.
                setWeapon(benefit);
                // console.log(benefit);
            } else if (benefit.type === 'ITEM') {
                let newItems = {};
                newItems[benefit.name] = 1;
                updateItems(newItems);

                updateLog([`You received a ${benefit.name}.`]);

                decreaseBenefits();
            } else if (benefit.type === 'CHARACTERISTIC') {
                let newUPP = {};
                newUPP[benefit.name] = upp[benefit.name] + benefit.value;
                updateUPP(newUPP);

                updateLog([`You raised your ${benefit.name} to ${newUPP[benefit.name]}.`]);

                decreaseBenefits();
            }
        }
    }

    function handleWeaponSelection(ev) {
        ev.preventDefault();

        let weaponName = '';
        for (let t of ev.target) {
            if (t.checked) {
                weaponName = t.value;
            }
        }

        // Check if the selected value is a specific weapon or a category of weapons
        if (CEITEMS.hasOwnProperty(weaponName)) {
            setWeapon({ name: weaponName });
        } else if (items.hasOwnProperty(weaponName) && items[weaponName] > 0) {
            // If the traveller already has taken that weapon as a benefit, offer them
            // an increase in the corresponding skill instead.
            setSkill(CEITEMS[weapon.name][weaponName].Skill);
            setWeapon({ name: weaponName });
        }
        else {
            let newItems = {};
            newItems[weaponName] = 1;
            updateItems(newItems);

            updateLog([`You received a weapon ${weaponName}.`]);

            decreaseBenefits();
            setWeapon(null);
        }
    }

    function handleCheck(check) {
        setSkillChecked(check);
    }

    function handleSkillOrWeapon(ev) {
        ev.preventDefault();

        // const input = ev.target[0];
        if (skillChecked) {
            let newSkill = {};
            if (!skills.hasOwnProperty(skill)) {
                newSkill[skill] = 1;
            } else {
                newSkill[skill] = skills[skill] + 1;
            }

            updateSkills(newSkill);
            
            updateLog([`You improved your ${skill} to ${newSkill[skill]}.`]);
        } else {
            let newItems = {};
            newItems[weapon.name] = 1;
            updateItems(newItems);

            updateLog([`You received a ${weapon.name}.`]);
        }

        decreaseBenefits();
        setSkill(null);
    }

    // Set the number of benefit rolls if it has not already been set.
    // Travellers get one benefit roll for each term they serve plus the following:
    // Ranks 1&2 1
    // Ranks 3&4 2
    // Ranks 5&6 3
    if (numBenefitRolls === INITBENEFITROLLS) {
        const curCareer = career[career.length-1]; // Get latest career
        let benefitRollMod = 0;
        
        switch (curCareer.rank) {
            case 0: 
            case 1:
            case 2: 
            case 3:
                break;
            case 4: 
                benefitRollMod = 1;
                break;
            case 5:
                benefitRollMod = 2;
                break;
            case 6: 
                benefitRollMod = 3;
                break;
            default: 
                throw new Error(`MusterOutCE: career rank ${curCareer.rank} is not in range 0-6!`);
        }

        setNumBenefitRolls(curCareer.term + benefitRollMod);
    }

    if (weapon === null && skill === null) {
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
                    <label>Choose either Cash or Material Benefits:</label>
                    {optionElts}
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    } else if (weapon && weapon.hasOwnProperty('name') && skill === null) { // Handle cascading weapon selection
        const itemData = CEITEMS[weapon.name];
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
    } else if (skill) { // Handle skill increase with an already selected weapon
        return (
            <form onSubmit={handleSkillOrWeapon} className="SkillOrWeapon">
                <p>You already have that weapon. Would you like an increase in that skill instead?</p>
                <Switch checked={skillChecked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
        );
    } else {
        return (<div></div>);
    }
}