import { capitalize, r1d6, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

export function Survival({ game, upp, career, display, onSurvival, onDeath, updateLog }) {
    if (display && game === 'classic') {
        return (
            <SurvivalCT 
                game={game}
                upp={upp}
                career={career}
                onSurvival={onSurvival}
                onDeath={onDeath}
                updateLog={updateLog}
            />);
    } else {
        return (<div></div>);
    }
}

function SurvivalCT({ upp, career, onSurvival, onDeath, updateLog }) {
    const careerData = CTCAREERS.filter(career => career.name === career.name)[0];
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
            console.log(`Because your ${dm.characteristic} of ${upp[dm.characteristic]} is greater than or equal to ${dm.value}, your roll of ${oldroll} has been increased by ${dm.dm}.`);
            roll += dm.dm;
        }
    }
    console.log(`Your final roll is ${roll}.`);
    return roll;
}



