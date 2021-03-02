import { useState } from 'react';
import Modal from 'react-modal';
import Switch from 'react-switch';

import { capitalize, r1d6, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

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
                    updateCareer({branch: c.value, term: 0, rank: 0, drafted: false});
                } else {
                    const draftCareerName = draft();
                    updateLog([
                        `Sorry! You did not qualify for the ${capitalize(c.value)}.`,
                        `Instead, you were drafted into the ${capitalize(draftCareerName)}.`,
                    ]);
                    updateCareer({branch: draftCareerName, term: 0, rank: 0, drafted: true});
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
        if (didSurvive) {
            return (
                <div className="CommissionAndPromotion">
                    <Commission upp={upp} career={career} step={step} updateCareer={updateCareer} updateLog={updateLog} /> 
                    <Promotion upp={upp} career={career} step={step} updateCareer={updateCareer} updateLog={updateLog} /> 
                </div>
            );
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
                updateLog([`Congratulations! You are now a Rank 1 ${careerData.ranks[1].name}.`]);
                updateCareer({rank: 1});
            } else {
                updateLog([`Sorry, you failed to get a commission in term ${career.term+1}.`]);
            }
        }
    }

    const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
    if (career.rank === 0 && careerData.commission && (!career.drafted || career.term > 0)) {
        return (
            <form onSubmit={attemptCommission} className="Commission">
                <p>Would you like to try for a commission?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
        );
    }
    
    return (<div></div>);
}

function Promotion({upp, career, step, updateCareer, updateLog}) {
    let [checked, setChecked] = useState(true);

    function handleCheck(check) {  
        setChecked(check);
    }

    function attemptPromotion(ev) {
        ev.preventDefault();
        const input = ev.target[0];
        if (input.checked) {
            const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
            const result = applyDMsToRoll(r2d6(), careerData.promotion.dms, upp);
            if (result >= careerData.promotion.target) {
                let rank = career.rank+1;
                updateLog([`Congratulations! You are now a Rank ${rank} ${careerData.ranks[rank].name}.`]);
                updateCareer({rank: rank});
            } else {
                updateLog([`Sorry, you failed to get a promotion in term ${career.term+1}.`]);
            }
        }
    }

    const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
    if (career.rank > 0 && careerData.promotion && (!career.drafted || career.term > 0)) {
        return (
            <form onSubmit={attemptPromotion} className="Promotion">
                <p>Would you like to try for a promotion?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
        );
    }
    
    return (<div></div>);
}
