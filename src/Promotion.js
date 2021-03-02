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

export function Promotion({game, upp, career, updateCareer, display, onSuccess, onFailure, updateLog}) {
    if (display && game === 'classic') {
        return (
            <PromotionCT
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

function PromotionCT({upp, career, updateCareer, onSuccess, onFailure, updateLog}) {
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
                onSuccess();
            } else {
                updateLog([`Sorry, you failed to get a promotion in term ${career.term+1}.`]);
                onFailure();
            }
        } else {
            updateLog([`You did not attempt a promotion in term ${career.term+1}.`]);
            onFailure();
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