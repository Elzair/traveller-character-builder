import { applyDMsToRoll, r2d6 } from "./utils";

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
    let roll = r2d6();

    if (careerData.survival.hasOwnProperty('dms')) {
       roll = applyDMsToRoll(r2d6(), careerData.survival.dms, upp, career.term); // Belter's survival odds go up with each term they have.
    }

    const didSurvive = roll >= careerData.survival.target;

    if (didSurvive) {
        onSurvival();
    } else {
        onDeath();
    }

    return ( <div></div> )
}



