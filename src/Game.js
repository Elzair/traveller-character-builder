import React from 'react';
import { useState } from 'react';

const DEFAULTMAXTERMS = 7;

export function Game({name, setName, game, setGame, display, onFinished, options, updateOptions}) {
    let [rearrangeCharacteristics, setRearrangeCharacteristics] = useState(false);
    let [mishap, setMishap] = useState(false);
    let [maxTerms, setMaxTerms] = useState(DEFAULTMAXTERMS);

    function handleSubmit(ev) {
        ev.preventDefault();

        if (name !== '') {
            if (game === 'mt2e') {
                updateOptions({ 
                    rearrangeCharacteristics: true,
                    mishap: true,
                    maxTerms
                });
            } else if (game === 'cepheusengine') {
                updateOptions({
                    rearrangeCharacteristics,
                    mishap,
                    maxTerms
                });
            } else {
                updateOptions({ 
                    rearrangeCharacteristics: false,
                    mishap: false,
                    maxTerms: 7
                });
            }

            onFinished(game, name);
        }
    }

    function handleSelectGame(ev) {
        setGame(ev.target.value);

        // Reset options
        switch(ev.target.value) {
            case 'classic':
            case 'cepheusengine':
                setRearrangeCharacteristics(false);
                setMishap(false);
                break;
            case 'mt2e':
                setRearrangeCharacteristics(true);
                setMishap(true);
                break;
            default:
                throw new Error(`Game: Invalid game selected ${ev.target.value}`);
        }

        setMaxTerms(DEFAULTMAXTERMS);
    }

    function handleText(ev) {
        setName(ev.target.value);
    }

    function handleMaxTerms(ev) {
        ev.preventDefault();

        setMaxTerms(ev.target.valueAsNumber);
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
                onChange={handleMaxTerms}
            />
        );
    }

    if (display) {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Game:</label>
                    <select name="Game" onChange={handleSelectGame}>
                        <option value="mt2e">Mongoose Traveller 2nd Edition</option>
                        <option value="classic">Classic Traveller</option>
                        <option value="cepheusengine">Cepheus Engine</option>
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