var array = [];

export function r1d6() {
    return array.length > 0 ? array.shift() : (Math.floor(Math.random()*6)+1)
}

export function r2d6() {
    return r1d6() + r1d6();
}

export function randElt(arr) {
    return arr[array.length > 0 ? array.shift() : (Math.floor(Math.random()*arr.length))];
}

export function getValues(arr) {
    array = [...arr]
}