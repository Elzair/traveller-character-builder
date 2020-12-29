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
    let newnum = num;
    if (newnum < 0 || newnum >= 34 ) {
        throw `Number out of bounds: ${newnum}`;
    }

    if (newnum >= 18) { newnum++; }
    if (newnum >= 24) { newnum++; }

    return newnum.toString(36).toUpperCase();
}

export function padToTwo(num) {
    if (num < 0 || num > 99) {
        throw `${num} is out of bounds!`;
    }
    
    return ("0"+num).slice(-2);
}