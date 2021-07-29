import React from 'react';

import { num2tetra } from './utils';
import './UwpInput.css';

const MAX = 15;
const MIN = 0;

export function UwpInput({ name, value, setValue }) {
    return (
        <div className="UwpInputOuter">
            <p className="UwpName">{name}</p>
            <div className="UwpInput">
                <input className="UWPValue" type="text" name={name} value={num2tetra(value)} readOnly={true} />
                <div className="IncDec">
                    <input className="Inc" type="button" value="▲" onClick={() => setValue(Math.min(value + 1, MAX))} />
                    <input className="Dec" type="button" value="▼" onClick={() => setValue(Math.max(value - 1, MIN))} />
                </div>
            </div>
        </div>
    );
}