import { r1d6, r2d6, getValues } from './random';

test('r1d6() produces random number with empty array', () => {
    let r = r1d6();
    expect(r).toBeGreaterThanOrEqual(1);
    expect(r).toBeLessThanOrEqual(6);
});

test('r1d6() should produce a specific number after getValues is called', () => {
    getValues([1, 5, 4, 6, 3, 2]);
    expect(r1d6()).toEqual(1);
});

test('r1d6() should produce a specific number after last test', () => {
    expect(r1d6()).toEqual(5);
});

test('r2d6() should produce a specific number after last test', () => {
    expect(r2d6()).toEqual(10);
    expect(r2d6()).toEqual(5);
});

test('r1d6() should produce a number within 1-6 after values are used up', () => {
    let r = r1d6();
    expect(r).toBeGreaterThanOrEqual(1);
    expect(r).toBeLessThanOrEqual(6);
})