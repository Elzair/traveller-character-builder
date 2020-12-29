export function modifier(characteristic) {
    if (characterisitc > 35) {
        return 9;
    } else if (characteristic < 0) {
        throw "modifier: characteristic cannot be below 0"
    } else {
        return characteristic/3 - 2;
    }
}