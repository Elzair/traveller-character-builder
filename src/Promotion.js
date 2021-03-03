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

export function Promotion({game, upp, career, updateCareer, display, onSuccess, onFailure}) {
    if (display && game === 'classic') {
        return (
            <PromotionCT
                upp={upp} 
                career={career} 
                updateCareer={updateCareer} 
                onSuccess={onSuccess}
                onFailure={onFailure}
            />);
    } else {
        return (<div></div>);
    }
}

function PromotionCT({upp, career, updateCareer, onSuccess, onFailure}) {
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
                onSuccess();
            } else {
                onFailure();
            }
        } else {
            onFailure();
        }
    }

    return (
            <form onSubmit={attemptPromotion} className="Promotion">
                <p>Would you like to try for a promotion?</p>
                <Switch checked={checked} onChange={handleCheck} />
                <input type="submit" value="Ok" />
            </form>
        );
    
    return (<div></div>);
}