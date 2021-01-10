import { useState } from 'react';
import Modal from 'react-modal';
import Switch from 'react-switch';

import { capitalize, r1d6, r2d6 } from "./utils";

export function Career({game, step, setStep, career, updateCareer, upp, setUPP, updateLog }) {
    if (game === 'classic') {
        return (
            <CareerCT 
                step={step} 
                setStep={setStep} 
                career={career} 
                updateCareer={updateCareer} 
                upp={upp} 
                setUpp={setUPP}
                updateLog={updateLog}
            />);
    } else {
        return (<div></div>);
    }
}

const CTCAREERS = [
    {
        name: "navy",
        enlistment: {
            target: 8,
            dms: [ 
                { characteristic: "Intellect", value: 8, dm: 1, }, 
                { characteristic: "Education", value: 9, dm: 2, },
            ],
        },
        draftNumber: 1,
        survival: {
            target: 5,
            dms: [
                { characteristic: "Intellect", value: 7, dm: 2, },
            ],
        },
        commission: {
            target: 10,
            dms: [
                { characteristic: "Social", value: 9, dm: 1, },
            ],
        },
        promotion: {
            target: 8,
            dms: [
                { characteristic: "Education", value: 8, dm: 1, },
            ],
        },
        reenlist: {
            target: 6,
        },
        ranks: [ 
            { name: 'Seaman', },
            { name: 'Ensign', }, 
            { name: 'Lieutenant', }, 
            { name: 'Lieutenant Commander', }, 
            { name: 'Commander', }, 
            { name: 'Captain', benefits: [{ type: 'CHARACTERISTIC', name: 'Social', value: 1, }], }, 
            { name: 'Admiral', benefits: [{ type: 'CHARACTERISTIC', name: 'Social', value: 1, }], }, 
        ],
        benefits: [
            { type: 'ITEM', name: 'Low Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Intellect', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 2, },
            { type: 'WEAPON', name: 'Blade', altSkill: 'Blade Combat', },
            { type: 'SPECIAL', name: "Traveller's Aid Society Membership", },
            { type: 'ITEM', name: 'High Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Social', value: 2, },
        ],
        cash: [
            1000, 5000, 5000, 10000, 20000, 50000, 50000,
        ],
        pdt: [
            { type: 'CHARACTERISTIC', name: 'Strength', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Dexterity', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Endurance', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Intellect', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Social', value: 1, },
        ],
        sst: [
            { type: 'SKILL', name: "Ship's Boat", value: 1, },
            { type: 'SKILL', name: "Vacc Suit", value: 1, },
            { type: 'SKILL', name: "Forward Observer", value: 1, },
            { type: 'SKILL', name: "Gunnery", value: 1, },
            { type: 'SKILL', name: "Blade Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
        ],
        aet1: [
            { type: 'SKILL', name: "Vacc Suit", value: 1, },
            { type: 'SKILL', name: "Mechanical", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Engineering", value: 1, },
            { type: 'SKILL', name: "Gunnery", value: 1, },
            { type: 'SKILL', name: "Jack of All Trades", value: 1, },
        ],
        aet2: [
            { type: 'SKILL', name: "Medical", value: 1, },
            { type: 'SKILL', name: "Navigation", value: 1, },
            { type: 'SKILL', name: "Engineering", value: 1, },
            { type: 'SKILL', name: "Computer", value: 1, },
            { type: 'SKILL', name: "Pilot", value: 1, },
            { type: 'SKILL', name: "Administration", value: 1, },
        ],
    },
    {
        name: "marines",
        enlistment: {
            target: 9,
            dms: [ 
                { characteristic: "Intellect", value: 8, dm: 1, }, 
                { characteristic: "Strength", value: 8, dm: 2, },
            ],
        },
        draftNumber: 2,
        survival: {
            target: 6,
            dms: [
                { characteristic: "Endurance", value: 8, dm: 2, },
            ],
        },
        commission: {
            target: 9,
            dms: [
                { characteristic: "Education", value: 7, dm: 1, },
            ],
        },
        promotion: {
            target: 9,
            dms: [
                { characteristic: "Social", value: 8, dm: 1, },
            ],
        },
        reenlist: {
            target: 6,
        },
        ranks: [ 
            { name: 'Private', benefits: [{ type: 'SKILL', name: 'Cutlass', value: 1, }] },
            { name: 'Lieutenant', beneftis: [{ type: 'SKILL', name: 'Revolver', value: 1, }] }, 
            { name: 'Captain', }, 
            { name: 'Force Commander', }, 
            { name: 'Lieutenant Colonel', }, 
            { name: 'Colonel', }, 
            { name: 'Brigadier', }, 
        ],
        benefits: [
            { type: 'ITEM', name: 'Low Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Intellect', value: 2, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 1, },
            { type: 'WEAPON', name: 'Blade', altSkill: 'Blade Combat', },
            { type: 'SPECIAL', name: "Traveller's Aid Society Membership", },
            { type: 'ITEM', name: 'High Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Social', value: 2, },
        ],
        cash: [
            2000, 5000, 5000, 10000, 20000, 30000, 40000,
        ],
        pdt: [
            { type: 'CHARACTERISTIC', name: 'Strength', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Dexterity', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Endurance', value: 1 },
            { type: 'SKILL', name: 'Gambling', value: 1, },
            { type: 'SKILL', name: 'Brawling', value: 1, },
            { type: 'SKILL', name: 'Blade Combat', value: 1, cascade: true, },
        ],
        sst: [
            { type: 'SKILL', name: "Vehicle", value: 1, cascade: true, },
            { type: 'SKILL', name: "Vacc Suit", value: 1, },
            { type: 'SKILL', name: "Blade Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Blade Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
        ],
        aet1: [
            { type: 'SKILL', name: "Vehicle", value: 1, cascade: true, },
            { type: 'SKILL', name: "Mechanical", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Tactics", value: 1, },
            { type: 'SKILL', name: "Blade Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
        ],
        aet2: [
            { type: 'SKILL', name: "Medical", value: 1, },
            { type: 'SKILL', name: "Tactics", value: 1, },
            { type: 'SKILL', name: "Tactics", value: 1, },
            { type: 'SKILL', name: "Computer", value: 1, },
            { type: 'SKILL', name: "Leader", value: 1, },
            { type: 'SKILL', name: "Administration", value: 1, },
        ],
    },
    {
        name: "army",
        enlistment: {
            target: 5,
            dms: [ 
                { characteristic: "Dexterity", value: 6, dm: 1, }, 
                { characteristic: "Endurance", value: 5, dm: 2, },
            ],
        },
        draftNumber: 3,
        survival: {
            target: 5,
            dms: [
                { characteristic: "Education", value: 6, dm: 2, },
            ],
        },
        commission: {
            target: 5,
            dms: [
                { characteristic: "Endurance", value: 7, dm: 1, },
            ],
        },
        promotion: {
            target: 6,
            dms: [
                { characteristic: "Education", value: 7, dm: 1, },
            ],
        },
        reenlist: {
            target: 7,
        },
        ranks: [ 
            { name: 'Private', benefits: [{ type: 'SKILL', name: 'Rifle', value: 1, }] },
            { name: 'Lieutenant', beneftis: [{ type: 'SKILL', name: 'SMG', value: 1, }] }, 
            { name: 'Captain', }, 
            { name: 'Major', }, 
            { name: 'Lieutenant Colonel', }, 
            { name: 'Colonel', }, 
            { name: 'General', }, 
        ],
        benefits: [
            { type: 'ITEM', name: 'Low Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Intellect', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 2, },
            { type: 'WEAPON', name: 'Gun', altSkill: 'Gun Combat', },
            { type: 'ITEM', name: 'High Passage Ticket', },
            { type: 'ITEM', name: 'Mid Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Social', value: 1, },
        ],
        cash: [
            2000, 5000, 10000, 10000, 10000, 20000, 30000,
        ],
        pdt: [
            { type: 'CHARACTERISTIC', name: 'Strength', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Dexterity', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Endurance', value: 1 },
            { type: 'SKILL', name: 'Gambling', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 1, },
            { type: 'SKILL', name: 'Brawling', value: 1, },
        ],
        sst: [
            { type: 'SKILL', name: "Vehicle", value: 1, cascade: true, },
            { type: 'SKILL', name: "Air/Raft", value: 1, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Forward Observer", value: 1, },
            { type: 'SKILL', name: "Blade Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
        ],
        aet1: [
            { type: 'SKILL', name: "Vehicle", value: 1, cascade: true, },
            { type: 'SKILL', name: "Mechanical", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Tactics", value: 1, },
            { type: 'SKILL', name: "Blade Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
        ],
        aet2: [
            { type: 'SKILL', name: "Medical", value: 1, },
            { type: 'SKILL', name: "Tactics", value: 1, },
            { type: 'SKILL', name: "Tactics", value: 1, },
            { type: 'SKILL', name: "Computer", value: 1, },
            { type: 'SKILL', name: "Leader", value: 1, },
            { type: 'SKILL', name: "Administration", value: 1, },
        ],
    },
    {
        name: "scouts",
        enlistment: {
            target: 7,
            dms: [ 
                { characteristic: "Intellect", value: 6, dm: 1, }, 
                { characteristic: "Strength", value: 8, dm: 2, },
            ],
        },
        draftNumber: 4,
        survival: {
            target: 7,
            dms: [
                { characteristic: "Endurance", value: 9, dm: 2, },
            ],
        },
        commission: null,
        promotion: null,
        reenlist: {
            target: 3,
        },
        ranks: [ 
            { name: 'Scout', benefits: [{ type: 'SKILL', name: 'PIlot', value: 1, }] },
        ],
        benefits: [
            { type: 'ITEM', name: 'Low Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Intellect', value: 2, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 2, },
            { type: 'WEAPON', name: 'Blade', altSkill: 'Blade Combat', },
            { type: 'WEAPON', name: 'Gun', altSkill: 'Gun Combat', },
            { type: 'SHIP', name: 'Scout Ship', },
        ],
        cash: [
            20000, 20000, 30000, 30000, 50000, 50000, 50000,
        ],
        pdt: [
            { type: 'CHARACTERISTIC', name: 'Strength', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Dexterity', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Endurance', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Intellect', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 1, },
            { type: 'SKILL', name: 'Gun Combat', value: 1, cascade: true, },
        ],
        sst: [
            { type: 'SKILL', name: "Vehicle", value: 1, cascade: true, },
            { type: 'SKILL', name: "Vacc Suit", value: 1, },
            { type: 'SKILL', name: "Mechanical", value: 1, },
            { type: 'SKILL', name: "Navigation", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Jack of All Trades", value: 1, },
        ],
        aet1: [
            { type: 'SKILL', name: "Vehicle", value: 1, cascade: true, },
            { type: 'SKILL', name: "Mechanical", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Jack of All Trades", value: 1, },
            { type: 'SKILL', name: "Gunnery", value: 1, },
            { type: 'SKILL', name: "Medical", value: 1, },
        ],
        aet2: [
            { type: 'SKILL', name: "Medical", value: 1, },
            { type: 'SKILL', name: "Navigation", value: 1, },
            { type: 'SKILL', name: "Engineering", value: 1, },
            { type: 'SKILL', name: "Computer", value: 1, },
            { type: 'SKILL', name: "Pilot", value: 1, },
            { type: 'SKILL', name: "Jack of All Trades", value: 1, },
        ],
    },
    {
        name: "merchant",
        enlistment: {
            target: 7,
            dms: [ 
                { characteristic: "Strength", value: 7, dm: 1, }, 
                { characteristic: "Intellect", value: 6, dm: 2, },
            ],
        },
        draftNumber: 5,
        survival: {
            target: 5,
            dms: [
                { characteristic: "Intellect", value: 7, dm: 2, },
            ],
        },
        commission: {
            target: 4,
            dms: [
                { characteristic: "Intellect", value: 6, dm: 1, },
            ],
        },
        promotion: {
            target: 10,
            dms: [
                { characteristic: "Intellect", value: 9, dm: 1, },
            ],
        },
        reenlist: {
            target: 4,
        },
        ranks: [ 
            { name: 'Merchant',  },
            { name: '4th Officer', }, 
            { name: '3rd Officer', }, 
            { name: '2nd Officer', }, 
            { name: '1st Officer', benefits: [{ type: 'SKILL', name: 'Pilot', value: 1, }], }, 
            { name: 'Captain', }, 
        ],
        benefits: [
            { type: 'ITEM', name: 'Low Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Intellect', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 1, },
            { type: 'WEAPON', name: 'Gun', altSkill: 'Gun Combat', },
            { type: 'WEAPON', name: 'Blade', altSkill: 'Blade Combat', },
            { type: 'ITEM', name: 'Low Passage Ticket', },
            { type: 'SHIP', name: 'Free Trader', },
        ],
        cash: [
            1000, 5000, 10000, 20000, 20000, 40000, 40000,
        ],
        pdt: [
            { type: 'CHARACTERISTIC', name: 'Strength', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Dexterity', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Endurance', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Strength', value: 1 },
            { type: 'SKILL', name: 'Blade Combat', value: 1, cascade: true, },
            { type: 'SKILL', name: 'Bribery', value: 1, },
        ],
        sst: [
            { type: 'SKILL', name: "Vehicle", value: 1, cascade: true, },
            { type: 'SKILL', name: "Vacc Suit", value: 1, },
            { type: 'SKILL', name: "Jack of All Trades", value: 1, },
            { type: 'SKILL', name: "Steward", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
        ],
        aet1: [
            { type: 'SKILL', name: "Streetwise", value: 1, },
            { type: 'SKILL', name: "Mechanical", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Navigation", value: 1, },
            { type: 'SKILL', name: "Gunnery", value: 1, },
            { type: 'SKILL', name: "Medical", value: 1, },
        ],
        aet2: [
            { type: 'SKILL', name: "Medical", value: 1, },
            { type: 'SKILL', name: "Navigation", value: 1, },
            { type: 'SKILL', name: "Engineering", value: 1, },
            { type: 'SKILL', name: "Computer", value: 1, },
            { type: 'SKILL', name: "Pilot", value: 1, },
            { type: 'SKILL', name: "Administration", value: 1, },
        ],
    },
    {
        name: "other",
        enlistment: {
            target: 3,
            dms: [],
        },
        draftNumber: 6,
        survival: {
            target: 5,
            dms: [
                { characteristic: "Intellect", value: 9, dm: 2, },
            ],
        },
        commission: null,
        promotion: null,
        reenlist: {
            target: 5,
        },
        ranks: [],
        benefits: [
            { type: 'ITEM', name: 'Low Passage Ticket', },
            { type: 'CHARACTERISTIC', name: 'Intellect', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Education', value: 1, },
            { type: 'WEAPON', name: 'Gun', altSkill: 'Gun Combat', },
            { type: 'WEAPON', name: 'Blade', altSkill: 'Blade Combat', },
            { type: 'ITEM', name: 'High Passage Ticket', },
        ],
        cash: [
            1000, 5000, 10000, 10000, 10000, 50000, 100000,
        ],
        pdt: [
            { type: 'CHARACTERISTIC', name: 'Strength', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Dexterity', value: 1 },
            { type: 'CHARACTERISTIC', name: 'Endurance', value: 1 },
            { type: 'SKILL', name: 'Blade Combat', value: 1, cascade: true, },
            { type: 'SKILL', name: 'Brawling', value: 1, },
            { type: 'CHARACTERISTIC', name: 'Social', value: -1, },
        ],
        sst: [
            { type: 'SKILL', name: "Vehicle", value: 1, cascade: true, },
            { type: 'SKILL', name: "Gambling", value: 1, },
            { type: 'SKILL', name: "Brawling", value: 1, },
            { type: 'SKILL', name: "Bribery", value: 1, },
            { type: 'SKILL', name: "Blade Combat", value: 1, cascade: true, },
            { type: 'SKILL', name: "Gun Combat", value: 1, cascade: true, },
        ],
        aet1: [
            { type: 'SKILL', name: "Streetwise", value: 1, },
            { type: 'SKILL', name: "Mechanical", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Gambling", value: 1, },
            { type: 'SKILL', name: "Brawling", value: 1, },
            { type: 'SKILL', name: "Forgery", value: 1, },
        ],
        aet2: [
            { type: 'SKILL', name: "Medical", value: 1, },
            { type: 'SKILL', name: "Forgery", value: 1, },
            { type: 'SKILL', name: "Electronics", value: 1, },
            { type: 'SKILL', name: "Computer", value: 1, },
            { type: 'SKILL', name: "Streetwise", value: 1, },
            { type: 'SKILL', name: "Jack of All Trades", value: 1, },
        ],
    },
];

function applyDMsToRoll(roll, dms, upp) {
    let oldroll = roll;
    for (let dm of dms) {
        if (upp[dm.characteristic] >= dm.value) {
            console.log(`Because your ${dm.characteristic} of ${upp[dm.characteristic]} is greater than or equal to ${dm.value}, your roll of ${oldroll} has been increased by ${dm.dm}.`);
            roll += dm.dm;
        }
    }
    console.log(`Your final roll is ${roll}.`);
    return roll;
}

function canEnlist(upp, careerName) {
    const career = CTCAREERS.filter(career => career.name === careerName)[0];
    const result = applyDMsToRoll(r2d6(), career.enlistment.dms, upp);
    return result >= career.enlistment.target;
}

function draft() {
    const roll = r1d6();
    return CTCAREERS.filter(career => career.draftNumber === roll)[0].name;
}

function survive(upp, careerName) {
    const career = CTCAREERS.filter(career => career.name === careerName)[0];
    const result = applyDMsToRoll(r2d6(), career.survival.dms, upp);
    return result >= career.survival.target;
}

function CareerCT({step, setStep, career, updateCareer, upp, setUpp, updateLog }) {
    function selectCareer(ev) {
        ev.preventDefault();
        for (let c of ev.target) {
            if (c.checked) {
                // Determine if character can enlist.
                if (canEnlist(upp, c.value, updateLog)) {
                    updateLog([`Congratulations! You have enlisted in the ${capitalize(c.value)}!`]);
                    updateCareer({branch: c.value, terms: 0, rank: 0, drafted: false});
                } else {
                    const draftCareerName = draft();
                    updateLog([
                        `Sorry! You did not qualify for the ${capitalize(c.value)}.`,
                        `Instead, you were drafted into the ${capitalize(draftCareerName)}.`,
                    ]);
                    updateCareer({branch: draftCareerName, terms: 0, rank: 0, drafted: true});
                }
                setStep(3);
            }
        }
    }

    if (step === 2) {
        return (
            <form onSubmit={selectCareer}>
                <p>Select Career: </p>
                <input type="radio" id="car1" name="career" value="navy"/> <label for="car1">Navy</label>
                <input type="radio" id="car2" name="career" value="marines"/> <label for="car2">Marines</label>
                <input type="radio" id="car3" name="career" value="army"/> <label for="car3">Army</label>
                <input type="radio" id="car4" name="career" value="scouts"/> <label for="car4">Scouts</label>
                <input type="radio" id="car5" name="career" value="merchant"/> <label for="car5">Merchants</label>
                <input type="radio" id="car6" name="career" value="other"/> <label for="car6">Other</label>
                <input type="submit" value="Submit" />
            </form>
        );
    } else if (step === 3) {
        console.log('Got to step 3');
        const didSurvive = survive(upp, career.branch);
        console.log(`Survival: ${didSurvive}`);
        let substep = 0;
        if (didSurvive) {
            return ( <Commission upp={upp} career={career} step={step} updateCareer={updateCareer} updateLog={updateLog} /> );
        } else {
            updateLog(['You have died.']);
            setStep(10);
        }
    }

    return (<div></div>);
}

function Commission({upp, career, step, updateCareer, updateLog}) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {  
        setChecked(check);
    }

    function attemptCommission(ev) {
        ev.preventDefault();
        const input = ev.target[0];
        if (input.checked) {
            const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
            const result = applyDMsToRoll(r2d6(), careerData.commission.dms, upp);
            if (result >= careerData.commission.target) {
                updateLog([`Congratulations! You are now a Rank 1 ${careerData.ranks[1].name}`]);
                updateCareer({rank: 1});
            } else {
                updateLog([`Sorry, you failed to get a commission in term ${career.term+1}.`]);
            }
        }
    }

    const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
    if (career.rank === 0 && careerData.commission && (!career.drafted || career.terms > 0)) {
        return (
            <form onSubmit={attemptCommission} className="Commission">
                <p>Would you like to attempt a commission?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
        );
    }
    
    return (<div></div>);
}
