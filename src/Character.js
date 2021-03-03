import { capitalize, num2tetra } from "./utils";

import CTCAREERS from './data/ct/careers';

export function Character({game, name, career, upp, skills, age, credits, items, display}) {
    if (display && game === 'classic') {
        return (
            <CharacterCT
                name={name}
                upp={upp} 
                career={career} 
                skills={skills}
                age={age}
                credits={credits}
                items={items}
            />
        );
    } else {
        return (<div></div>);
    }
}

function CharacterCT({name, career, upp, skills, age, credits, items}) {
    const careerName = career !== null ? capitalize(career['branch']) : 'Unemployed';
    const careerTerms = career !== null ? career['term'] : 0;
    
    let rank = '';
    if (careerName !== 'Unemployed') {
        const careerData = CTCAREERS.filter(c => c.name === career.branch)[0];
        rank = careerData.ranks[career.rank].name;
    }

    let uppStr = Object.entries(upp).map(ent => num2tetra(ent[1])).join('');

    let charstr1 = `${name} ${careerName} ${rank} ${uppStr} Age ${age} ${careerTerms} terms Cr${credits}`;
    let charstr2 = Object.keys(skills).map(key => `${key}-${skills[key]}`).join(', ');

    // Count items in inventory
    let charstr3 = Object.keys(items).map(item => items[item] > 1 ? `${item}x${items[item]}` : item).join(', ');
    
    return (
        <div className="CharacterSheet">
            <p>{charstr1}</p>
            <p>{[charstr2, charstr3].join(' ')}</p>
        </div>
    )
}