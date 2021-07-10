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
    return str.replace(/^\w/, (c) => c.toUpperCase());
}

export function updateObject(obj, updates) {
    let newObj = {};
    
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        newObj[prop] = obj[prop];
      }
    }

    for (let prop in updates) {
      if (updates.hasOwnProperty(prop)) {
        newObj[prop] = updates[prop];
      }
    }
    
    return newObj;
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