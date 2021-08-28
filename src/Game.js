import React from 'react';
import { useState } from 'react';

export function Game({name, setName, game, setGame, display, onFinished, options, updateOptions}) {
    let [rearrangeCharacteristics, setRearrangeCharacteristics] = useState(false);
    let [mishap, setMishap] = useState(false);
    let [maxTerms, setMaxTerms] = useState(7); // The default maximum number of terms a traveller can take is SEVEN.

    function handleSubmit(ev) {
        ev.preventDefault();

        if (name !== '') {
            if (game === 'mt2e') {
                updateOptions({ rearrangeCharacteristics: true });
            } else if (game === 'cepheusengine') {
                updateOptions({
                    rearrangeCharacteristics,
                    mishap,
                    maxTerms
                });
            } else {
                updateOptions({ rearrangeCharacteristics: false });
            }
            onFinished(game, name);
        }
    }

    function handleSelectGame(ev) {
        setGame(ev.target.value);
    }

    function handleText(ev) {
        setName(ev.target.value);
    }

    let gameOpts = [];
    if (game === 'cepheusengine') {
        gameOpts.push(
            <input 
                type="checkbox" 
                id="rearrangeCharacteristics"
                name="rearrangeCharacteristics"
                checked={rearrangeCharacteristics}
                onChange={() => setRearrangeCharacteristics(!rearrangeCharacteristics)}
            />
        );
        gameOpts.push(<label htmlFor="rearrangeCharacteristics">Rearrange Characteristics</label>);
        gameOpts.push(
            <input 
                type="checkbox" 
                id="mishap"
                name="mishap"
                checked={mishap}
                onChange={() => setMishap(!mishap)}
            />
        );
        gameOpts.push(<label htmlFor="mishap">Use Mishaps</label>);
        gameOpts.push(<label htmlFor="maxTerms">Max Terms</label>);
        gameOpts.push(
            <input
                type="number"
                id="maxTerms"
                name="maxTerms"
                value={maxTerms}
                onChange={setMaxTerms}
            />
        );
    }

    if (display) {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Game:</label>
                    <select name="Game" onChange={handleSelectGame}>
                        <option value="cepheusengine">Cepheus Engine</option>
                        <option value="classic">Classic Traveller</option>
                        <option value="mt2e">Mongoose Traveller 2nd Edition</option>
                    </select>
                    {gameOpts}
                    <label>Character Name:</label>
                    <input type="text" value={name} onChange={handleText} />
                    <input type="submit" value="Ok" />
                </form>
            </div>
        );
    } else {
        return (<div></div>)
    }
}