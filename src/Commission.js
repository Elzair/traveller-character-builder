import { useState } from 'react';
import Switch from 'react-switch';

import { r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

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

export function Commission({game, upp, career, updateCareer, display, onSuccess, onFailure, updateLog}) {
    if (display && game === 'classic') {
        return (
            <CommissionCT
                upp={upp} 
                career={career} 
                updateCareer={updateCareer} 
                onSuccess={onSuccess}
                onFailure={onFailure} 
                updateLog={updateLog}
            />);
    } else {
        return (<div></div>);
    }
}

function CommissionCT({upp, career, updateCareer, onSuccess, onFailure, updateLog}) {
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
                onSuccess();
            } else {
                updateLog([`Sorry, you failed to get a commission in term ${career.term+1}.`]);
                onFailure();
            }
        } else {
            updateLog([`You did not attempt a commission in term ${career.term+1}.`]);
            onFailure();
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