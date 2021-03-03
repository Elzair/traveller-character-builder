import { r1d6 } from "./utils";

import CTCAREERS from './data/ct/careers';
import CTSKILLS from './data/ct/skills';

export function Skill({game, upp, career, display, onFinished, updateLog}) {
    if (display && game === 'classic') {
        return (
            <SkillCT 
                game={game}
                upp={upp}
                career={career}
                onFinished={onFinished}
                updateLog={updateLog}
            />);
    } else {
        return (<div></div>);
    }
}

function SkillCT({game, upp, career, display, onFinished, updateLog}) {
    function handleSkillSelection(ev) {
        ev.preventDefault();
        for (let t of ev.target) {
            if (t.checked) {
                const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
                const table = careerData[t.value];
                const skill = table[r1d6()-1];
                console.log(skill);
            }
        }
    }

    let options = {
        "pdt": "Personal Development",
        "sst": "Service Skills",
        "aet1": "Advanced Education",
    };
    if (upp.Education >= 8) {
        options['aet2'] = "Advanced Education 2";
    }
    const optionElts = Object.keys(options).map(prop => (
        <label>
            <input type="radio" id={prop} name="skilltable" value={prop}/>
            {options[prop]}
        </label>
    ));
    console.log(optionElts);
    
    return (
        <div>
            {<form onSubmit={handleSkillSelection}>
                <label>Choose an area to improve:</label>
                {optionElts}
                <input type="submit" value="Submit"/>
            </form>}
        </div>
    );
}