import { capitalize, r1d6, r2d6 } from "./utils";

import CTCAREERS from './data/ct/careers';

export function Career({ game, career, upp, display, onEnlistment, onDraft }) {
    if (display && game === 'classic') {
        return (
            <CareerCT
                career={career}
                upp={upp}
                onEnlistment={onEnlistment}
                onDraft={onDraft}
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

function CareerCT({ career, upp, onEnlistment, onDraft }) {
    function selectCareer(ev) {
        ev.preventDefault();
        for (let c of ev.target) {
            if (c.checked) {
                // Determine if character can enlist.
                if (canEnlist(upp, c.value)) {
                    onEnlistment({ branch: c.value, term: 0, rank: 0 });
                } else {
                    const draftCareerName = draft();
                    onDraft({ branch: draftCareerName, failedBranch: c.value, term: 0, rank: 0 });
                }
            }
        }
    }

    return (
        <form onSubmit={selectCareer}>
            <p>Select Career: </p>
            <input type="radio" id="car1" name="career" value="navy" /> <label for="car1">Navy</label>
            <input type="radio" id="car2" name="career" value="marines" /> <label for="car2">Marines</label>
            <input type="radio" id="car3" name="career" value="army" /> <label for="car3">Army</label>
            <input type="radio" id="car4" name="career" value="scouts" /> <label for="car4">Scouts</label>
            <input type="radio" id="car5" name="career" value="merchant" /> <label for="car5">Merchants</label>
            <input type="radio" id="car6" name="career" value="other" /> <label for="car6">Other</label>
            <input type="submit" value="Submit" />
        </form>
    );

}
