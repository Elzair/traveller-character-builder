import React from 'react';
import { capitalize, isObject, num2tetra } from "./utils";

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
    } else if (display && game === 'cepheusengine') {
        return (
            <CharacterCE
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
    const careerName = career.length > 0 ? capitalize(career[career.length-1].branch) : 'Unemployed';
    const careerTerms = career.length > 0 ? career[career.length-1].term : 0;
    
    let rank = '';
    if (careerName !== 'Unemployed') {
        const careerData = CTCAREERS.filter(c => c.name === career[career.length-1].branch)[0];
        rank = careerData.ranks[career[career.length-1].rank].name;
    }

    const uppStr = Object.entries(upp).map(ent => num2tetra(ent[1])).join('');

    const charstr1 = `${name} ${careerName} ${rank} ${uppStr} Age ${age} ${careerTerms} terms Cr${credits}`;
    const charstr2 = Object.keys(skills).map(key => `${key}-${skills[key]}`).join(', ');

    // Count items in inventory (except for ships with leases)
    const charstr3 = Object.entries(items).filter(([_, val]) => !isObject(val) || !val.hasOwnProperty('lease'))
        .map(([name, count]) => count > 1 ? `${name}x${count}` : name).join(', ');
    
    // Display any information on ships the character might have received
    const shipsWithLeases = Object.entries(items).filter(([_, val]) => isObject(val) && val.hasOwnProperty('lease'));
    const charstr4 = shipsWithLeases.length > 0 ? 
        shipsWithLeases.map(([name, info]) => `Owns a ${name} with ${info.lease} years of payment left`) : '';
    
    return (
        <div className="CharacterSheet">
            <p>{charstr1}</p>
            <p>{[charstr2, charstr3].join(' ')}</p>
            <p>{charstr4}</p>
        </div>
    )
}

function CharacterCE({name, career, upp, skills, age, credits, items}) {
    const uppStr = Object.entries(upp).map(ent => num2tetra(ent[1])).join('');

    const charstr1 = `${name} ${uppStr} Age ${age} Cr${credits}`;
    const charstr2 = career.map(({ branch, term }) => `${capitalize(branch)} (${term} terms)`).join(', ');

    const charstr3 = Object.entries(skills).sort((a, b) => {
        if (a[0] > b[0]) {
            return 1;
        } else if (a[0] > b[0]) {
            return -1;
        } else {
            return 0;
        }
    }).map(([name, value]) => `${name}-${value}`).join(', ');

    // Count items in inventory
    const charstr4 = Object.entries(items).map(([name, count]) => count > 1 ? `${name}x${count}` : name).join(', ');
    
    return (
        <div className="CharacterSheet">
            <p>{charstr1}</p>
            <p>{charstr2}</p>
            <p>{charstr3}</p>
            <p>{charstr4}</p>
        </div>
    )
}