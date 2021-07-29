import React from 'react';

import { UwpInput } from './UwpInput';

import './Homeworld.css';
import './default.css';

export function Homeworld({ uwp, updateUWP, tradeCodes, updateTradeCodes, display, onFinalized }) {
    function handleHomeworldSelection(ev) {
        ev.preventDefault();
        const codes = getTradeCodes(
            uwp.Starport, uwp.Size, uwp.Atmosphere, uwp.Hydrographics,
            uwp.Population, uwp.Government, uwp.LawLevel, uwp.TechLevel
        );
        updateTradeCodes(codes);

        onFinalized();
    }

    const codes = getTradeCodes(
        uwp.Starport, uwp.Size, uwp.Atmosphere, uwp.Hydrographics,
        uwp.Population, uwp.Government, uwp.LawLevel, uwp.TechLevel
    );

    if (display) {
        return (
            <div className="Homeworld">
                <p className="Header">Input UWP of your homeworld</p>
                <form onSubmit={handleHomeworldSelection}>
                    <div className="UWP">
                        <UwpInput name="St" value={uwp.Starport} setValue={val => updateUWP({ Starport: val })} />
                        <UwpInput name="Si" value={uwp.Size} setValue={val => updateUWP({ Size: val })} />
                        <UwpInput name="At" value={uwp.Atmosphere} setValue={val => updateUWP({ Atmosphere: val })} />
                        <UwpInput name="Hy" value={uwp.Hydrographics} setValue={val => updateUWP({ Hydrographics: val })} />
                        <UwpInput name="Pop" value={uwp.Population} setValue={val => updateUWP({ Population: val })} />
                        <UwpInput name="Gov" value={uwp.Government} setValue={val => updateUWP({ Government: val })} />
                        <UwpInput name="LL" value={uwp.LawLevel} setValue={val => updateUWP({ LawLevel: val })} />
                        <UwpInput name="TL" value={uwp.TechLevel} setValue={val => updateUWP({ TechLevel: val })} />
                    </div>
                    <input type="submit" value="Finalize"/>
                </form>
                <p className="HomeworldTradeCodes">{'Trade Codes: ' + codes.join(', ')}</p>
            </div>
        );
    } else {
        return (<div></div>);
    }
}

function getTradeCodes(starport, size, atmo, hydro, pop, gov, law, tech) {
    // Generate the main world's trade codes
    let codes = [];

    if (atmo >= 4 && atmo <= 9 && hydro >= 4 && hydro <= 8 && pop >= 5 && pop <= 7) {
        codes.push('Ag'); // Agricultural
    }

    if (size === 0 && atmo === 0 && hydro === 0) {
        codes.push('As'); // Asteroid
    }

    if (pop === 0 && gov === 0 && law === 0) {
        codes.push('Ba'); // Barren
    }

    if (atmo >= 2 && hydro === 0) {
        codes.push('De'); // Desert
    }

    if (atmo >= 10 && hydro >= 1) {
        codes.push('Fl'); // Fluid Oceans
    }

    if ((atmo === 5 || atmo === 6 || atmo === 8) && hydro >= 4 && hydro <= 9 && pop >= 4 && pop <= 8) {
        codes.push('Ga'); // Garden
    }

    if (pop >= 9) {
        codes.push('Hi'); // High Population
    }

    if (tech >= 12) {
        codes.push('Ht'); // High Technology
    }

    if (atmo >= 0 && atmo <= 1 && hydro >= 1) {
        codes.push('Ic'); // Ice-Capped
    }

    if (((atmo >= 0 && atmo <= 2) || atmo === 4 || atmo === 7 || atmo === 9) && pop >= 9) {
        codes.push('In'); // Industrial
    }

    if (pop >= 0 && pop <= 3) {
        codes.push('Lo'); // Low Population
    }

    if (tech <= 5) {
        codes.push('Lt'); // Low Technology
    }

    if (atmo >= 0 && atmo <= 3 && hydro >= 0 && hydro <= 3 && pop >= 6) {
        codes.push('Na'); // Non-Agricultural
    }

    if (pop >= 4 && pop <= 6) {
        codes.push('Ni'); // Non-Industrial
    }

    if (atmo >= 2 && atmo <= 5 && hydro >= 0 && hydro <= 3) {
        codes.push('Po'); // Poor
    }

    if ((atmo === 6 || atmo === 8) && pop >= 6 && pop <= 8) {
        codes.push('Ri'); // Rich
    }

    if (hydro === 10) {
        codes.push('Wa'); // Water World
    }

    if (atmo === 0) {
        codes.push('Va'); // Vacuum
    }

    // // Return trade codes array with a helper method to check if the planet has a specific trade code.
    // return {
    //     codes,
    //     contains: function(elt) {
    //         return this.codes.findIndex(el => el === elt) !== -1;
    //     }
    // };
    return codes;
}