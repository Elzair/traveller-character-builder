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