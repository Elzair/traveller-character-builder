import mersenneTwister from '.';

test('Generate a random number', () => {
    let obj = mersenneTwister({});
    expect(Object.keys(obj).length).toEqual(3);
    console.log(obj.num);
    expect(obj.next).toBe(1);
    expect(obj.state.length).toBe(624);
    // expect(markov(5).length).toBe(5);
});

test('Function returns same number with same seed', () => {
    let { num1, next1, state1 } = mersenneTwister({seed: 123456});
    let { num2, next2, state2 } = mersenneTwister({seed: 123456});

    expect(num1).toEqual(num2);
    expect(next1).toEqual(next2);

    let { num11, } = mersenneTwister({ num: num1, next: next1, state: state1 });
    let { num22, } = mersenneTwister({ num: num2, next: next2, state: state2 });

    expect(num11).toEqual(num22);
});

