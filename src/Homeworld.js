import React from 'react';

import { UwpInput } from './UwpInput';

export function Homeworld({name, upp}) {
    return (
        <div className="Homeworld">
            <input type="text" value={name} />
            <div className="UWP">
                <UwpInput value={8} />
            </div>
        </div>
    );
}