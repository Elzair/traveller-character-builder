import { r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

export function Survival({ game, upp, career, display, onSurvival, onDeath }) {
    if (display && game === 'classic') {
        return (
            <SurvivalCT 
                game={game}
                upp={upp}
                career={career}
                onSurvival={onSurvival}
                onDeath={onDeath}
            />
        );
    } else {
        return (<div></div>);
    }
}

function SurvivalCT({ upp, career, onSurvival, onDeath }) {
    const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
    const result = applyDMsToRoll(r2d6(), careerData.survival.dms, upp);
    const didSurvive = result >= careerData.survival.target;

    if (didSurvive) {
        onSurvival();
    } else {
        onDeath();
    }

    return ( <div></div> )
}

function applyDMsToRoll(roll, dms, upp) {
    let oldroll = roll;
    for (let dm of dms) {
        if (upp[dm.characteristic] >= dm.value) {
            console.log(`Survival: Because your ${dm.characteristic} of ${upp[dm.characteristic]} is greater than or equal to ${dm.value}, your roll of ${oldroll} has been increased by ${dm.dm}.`);
            roll += dm.dm;
        }
    }
    console.log(`Your final roll is ${roll}.`);
    return roll;
}



