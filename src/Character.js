import { capitalize, num2tetra } from "./utils";

import CTCAREERS from './data/ct/careers';

export function Character({game, name, career, upp, skills, age, display}) {
    if (display && game === 'classic') {
        return (
            <CharacterCT
                name={name}
                upp={upp} 
                career={career} 
                skills={skills}
                age={age}
            />
        );
    } else {
        return (<div></div>);
    }
}

function CharacterCT({name, career, upp, skills, age}) {
    const careerName = career !== null ? capitalize(career['branch']) : 'Unemployed';
    const careerTerms = career !== null ? career['term'] : 0;
    
    let rank = '';
    if (careerName !== 'Unemployed') {
        const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
        rank = careerData.ranks[career.rank].name;
    }

    let uppStr = Object.entries(upp).map(ent => num2tetra(ent[1])).join('');

    let charstr1 = `${name} ${careerName} ${rank}\t${uppStr}\tAge ${age}\t${careerTerms} terms`;
    let charstr2 = Object.keys(skills).map(key => `${key}-${skills[key]}`).join(',');
    return (
        <div className="CharacterSheet">
            <p>{charstr1}</p>
            <p>{charstr2}</p>
        </div>
    )
}