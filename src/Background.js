import React from 'react';
import { useState } from 'react';

import { modCE } from './utils';

import './Background.css';
import './default.css';

const DEFAULTSKILLNUM = 99;

export function Background({ game, upp, homeworldUWP, homeworldTradeCodes, skills, updateSkills, display, onFinalized, updateLog }) {
    if (display && game === 'cepheusengine') {
        return (
            <BackgroundCE
                upp={upp}
                homeworldUWP={homeworldUWP}
                codes={homeworldTradeCodes}
                skills={skills}
                updateSkills={updateSkills}
                onFinalized={onFinalized}
                updateLog={updateLog}
            />
        );
    } else {
        return (<div></div>);
    }
}

function BackgroundCE({ upp, homeworldUWP, codes, skills, updateSkills, onFinalized, updateLog }) {
    let [numBgSkills, setNumBgSkills] = useState(99); // Default to a high number
    // `checks` and `bgSkills` should be arrays of the same length since they correspond to each other.
    // If `checks[i]===true` then `bgSkills[i]` has been selected.
    let [checks, setChecks] = useState([]);
    let [bgSkills, setBgSkills] = useState([]);

    function selectSkills() {
        let newSkills = {};

        for (let i=0; i<checks.length; i++) {
            if (checks[i]) {
                newSkills[bgSkills[i][0]] = bgSkills[i][1];
            }
        }
        console.log(newSkills);

        updateSkills(newSkills);
        setChecks([]);
        setBgSkills({});
        setNumBgSkills(DEFAULTSKILLNUM);
        onFinalized();
    }

    function handleCheck(ev) {
        const idx = bgSkills.findIndex(sk => sk[0] === ev.target.name);
        let newChecks = [...checks];

        // Only allow checks if the traveller still has background skills to select
        if (numBgSkills > 0) {
            newChecks[idx] = !newChecks[idx];
            setChecks(newChecks);
            setNumBgSkills(newChecks[idx] ? numBgSkills-1 : numBgSkills+1);
        }
    }

    if (numBgSkills === DEFAULTSKILLNUM) {
        let numSkills = 5 + modCE(upp.Education);
        let backgroundSkills = getSkillListCE(codes, homeworldUWP);
        let newChecks = new Array(backgroundSkills.length);
        for (let i=0; i<newChecks.length; i++) {
            newChecks[i] = false;
        }

        setNumBgSkills(numSkills);
        setBgSkills(backgroundSkills);
        setChecks(newChecks);

        return (<div></div>);
    } else {
        const backgroundSkills = bgSkills.map((ent, idx) => (
            <label key={`${ent[0]}-${ent[1]}`}>
                <input type="checkbox" name={ent[0]} checked={checks[idx]} onChange={handleCheck} />
                {`${ent[0]}-${ent[1]}`}
            </label>
        ));

        return (
            <div className="BackgroundSkills">
                <p className="Header">{`Select ${numBgSkills} background skills`}</p>
                <form className="BackgroundSkills" onSubmit={selectSkills}>
                    {backgroundSkills}
                    <input className="BackgroundSubmit" type="submit" value="Finalize" disabled={numBgSkills>0} />
                </form>
            </div>
        );
    }
}

// Helper function to check if the trade codes array has a specific trade code
function contains(codes, code) {
    return codes.findIndex(c => c === code) !== -1;
}

function getSkillListCE(codes, uwp) {
    // These are the default background skills any traveller can take.
    let backgroundSkills = {
        Admin: 0,
        Advocate: 0,
        Animals: 0,
        Carousing: 0,
        Comms: 0,
        Computer: 0,
        Electronics: 0,
        Engineering: 0,
        "Life Sciences": 0,
        Linguistics: 0,
        Mechanics: 0,
        Medicine: 0,
        "Physical Sciences": 0,
        "Social Sciences": 0,
        "Space Sciences": 0
    };

    if (uwp.LawLevel < 7) {
        backgroundSkills["Gun Combat"] = 0;
    } else {
        backgroundSkills["Melee Combat"] = 0;
    }

    // Get potentail background skills based on homeworld trade codes.

    if (contains(codes, 'As') || contains(codes, 'Ic') || contains(codes, 'Va')) {
        backgroundSkills["Zero-G"] = 0;
    }

    if (contains(codes, 'De') || contains(codes, 'Lt')) {
        backgroundSkills["Survival"] = 0;
    }

    if (contains(codes, 'Fl') || contains(codes, 'Wa')) {
        backgroundSkills["Watercraft"] = 0;
    }

    if (contains(codes, 'Hi')) {
        backgroundSkills["Streetwise"] = 0;
    }

    if (contains(codes, 'In')) {
        backgroundSkills["Broker"] = 0;
    }

    // Turn `backgroundSkills` into a sorted array for easier use.
    const backSk = Object.entries(backgroundSkills).sort((a, b) => {
        if (a[0].toUpperCase() < b[0].toUpperCase()) {
            return -1;
        } else if (a[0].toUpperCase() > b[0].toUpperCase()) {
            return 1;
        } else {
            return 0;
        }
    });

    return backSk;
}

