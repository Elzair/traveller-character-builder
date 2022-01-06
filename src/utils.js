export function r1d6() {
    return Math.floor(Math.random()*6)+1;
}

export function r2d6() {
    return r1d6()+r1d6();
}

export function constrain(num, min, max) {
    return Math.min(max, Math.max(min, num));
}

export function num2tetra(num) {
    if (num < 0 || num >= 34 ) {
        throw new Error(`Number out of bounds: ${num}`);
    }

    if (num >= 23) { num++; } // Skip 'I'
    if (num >= 24) { num++; } // Skip 'O'

    return num.toString(36).toUpperCase();
}

export function padToTwo(num) {
    if (num < 0 || num > 99) {
        throw new Error(`${num} is out of bounds!`);
    }
    
    return ("0"+num).slice(-2);
}

export function capitalize(str) {
    if (str.includes('/')) {
        return str.split('/').map(s => s.replace(/^\w/, c => c.toUpperCase())).join('/');
    } else if (str.includes(' ')) {
        return str.split(' ').map(s => s.replace(/^\w/, c => c.toUpperCase())).join(' ');
    } else {
        return str.replace(/^\w/, (c) => c.toUpperCase());
    }
}

export function updateObject(obj, updates) {
    return {
        ...obj,
        ...updates
    };
}

export function applyDMsToRoll(roll, dms, upp, terms=-1) {
    // let oldroll = roll;
    for (let dm of dms) {
        if (dm.characteristic === "Terms" && terms >= 0) { // Handle the "Terms" characteristic specially for Survival rolls for Belters
            roll += terms;
        } else {
            if (dm.lower && upp[dm.characteristic] <= dm.value) {
                // console.log(`Career: Because your ${dm.characteristic} of ${upp[dm.characteristic]} is less than or equal to ${dm.value}, your roll of ${oldroll} has been increased by ${dm.dm}.`);
                roll += dm.dm;
            } else if (!dm.lower && upp[dm.characteristic] >= dm.value) {
                // console.log(`Career: Because your ${dm.characteristic} of ${upp[dm.characteristic]} is greater than or equal to ${dm.value}, your roll of ${oldroll} has been increased by ${dm.dm}.`);
                roll += dm.dm;
            }
        }
    }
    // console.log(`Your final roll is ${roll}.`);
    return roll;
}

export function modCE(n) { 
    return Math.min(Math.floor(n / 3) - 2, 9); 
}

export function modRollCE(upp, char, nat2Fails=false, mods=0) {
    const roll =  r2d6();
    if (nat2Fails && roll === 2) {
        return roll;
    } else {
        return roll + mods + modCE(upp[char]);
    }
}

export function modMT2E(n) {
    return n === 0 ? -3 : Math.min(Math.floor(n / 3) - 2, 3);
}

export function modRollMT2E(upp, char, skills, skill, mods) {
    let roll = r2d6();
    
    // Add a characteristic modifier if appropriate
    if (upp !== null && char !== null) {
        roll += modMT2E(upp[char]);
    }

    // Add a skill modifier if approprate
    if (skills !== null && skill !== null) {
        let skillMod = skills.hasOwnProperty(skill) ? skills[skill] : -3;
        roll += skillMod;
    }

    roll += mods; // Add any other random modifiers

    return roll;
}

export function checkMT2E(target, upp, char, skills, skill, mods, useNaturals=false) {
    let roll = r2d6();
    let autoFail = false;
    let autoSuccess = false;

    // If `useNatural` is true, a roll of 2 is an automatic failure and a roll of 12 is an automatic success
    if (useNaturals) {
        if (roll === 2) {
            autoFail = true;
        } else if (roll === 12) {
            autoSuccess = true;
        }
    }
    
    // Add a characteristic modifier if appropriate
    if (upp !== null && char !== null) {
        roll += modMT2E(upp[char]);
    }

    // Add a skill modifier if approprate
    if (skills !== null && skill !== null) {
        let skillMod = skills.hasOwnProperty(skill) ? skills[skill] : -3;
        roll += skillMod;
    }

    roll += mods; // Add any other random modifiers

    return {
        roll,
        success: roll >= target,
        autoFail,
        autoSuccess
    };
}

export function isObject(val) {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function randElt(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}

export function findTerm(age) {
    return Math.floor((age-14)/4);
}

export function getSkillNames(name) {
    let regexp1 = new RegExp('.*\\(');
    let regexp2 = new RegExp('\\(.*\\)');

    const tmpStr = name.match(regexp1);

    if (tmpStr) {
        const main = tmpStr[0].substring(0, tmpStr[0].length-1).trimEnd(); // Remove everything past '(' and trim any trailing whitespace
        
        const tmpStr2 = name.match(regexp2)[0];
        const sub = tmpStr2.substring(1, tmpStr2.length-1); // Remove '(' and ')'

        return { main, sub };
    } else {
        return { main: name, sub: null };
    }
}