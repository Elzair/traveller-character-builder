const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df;
const UPPER_MASK = 0x80000000;
const LOWER_MASK = 0x7fffffff;

function twist(state) {
    let newState = [...state];
    let bits;

    // Twist first 227 words.
    for (let i=0; i<N-M; i++) {
        bits = (newState[i] & UPPER_MASK) | (newState[i+1] & LOWER_MASK);
        newState[i] = newState[i+M] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A);
    }

    // Twist all but the last word.
    for (let i=N-M; i<N-1; i++) {
        bits = (newState[i] & UPPER_MASK) | (newState[i+1] & LOWER_MASK);
        newState[i] = newState[i+M-N] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A);
    }

    // Twist the last word with a wrap around to the first word.
    bits = (newState[N-1] & UPPER_MASK) | (newState[0] & LOWER_MASK);
    newState[N-1] = newState[N-1] ^ (bits >>> 1) ^ ((bits & 1) * MATRIX_A);

    return newState;
}

function init(seed) {
    let state = new Array(N);

    // Fill initial state
    state[0] = seed;
    
    for (let i=1; i<N; i++) {
        let s = state[i-1] ^ (state[i-1] >>> 30);
        // Split 32 bits into 2x 16 bits to avoid multiplication overflow
        state[i] = (
            (
                (
                    (
                        (s & 0xffff0000) >>> 16
                    ) * 1812433253
                ) << 16
            ) + (s & 0x0000ffff) * 1812433253
        ) + i;
    }

    return twist(state);
}

export default function mersenneTwister({ seed=5489, next=0, state=[]}) {
    let newState = [...state];

    // Initialize the state array if it is empty
    if (newState.length === 0) {
        newState = init(seed);
        next = 0;
    }
    // Otherwise twist 
    else if (next >= N) {
        newState = twist(newState);
        next = 0;
    }

    let x = newState[next++];

    // Tempering
    x ^= x >>> 11;
    x ^= (x << 7) & 0x9d2c5680;
    x ^= (x << 15) & 0xefc60000;
    x ^= x >>> 18;

    // Convert to unsigned
    x = x >>> 0;

    // Return number along with state and position
    return {
        num: x,
        next,
        state: newState
    };
}

