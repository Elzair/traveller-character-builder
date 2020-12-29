import { num2tetra } from "./utils";


export function Characteristics(props) {
    let stats = [];
    if (!props.hasOwnProperty('stats')) {
        throw "Characteristics was not passed stats to display!";
    }

    for (let stat in props.stats) {
        if (props.stats.hasOwnProperty(stat)) {
            stats.push(<Characteristic name={stat} value={props.stats[stat]} />);
        }
    }

    return (
        <div className="Characteristics">{stats}</div>
    )
}

export function Characteristic(props) {
    const value = num2tetra(props.value);
    return (
        <p>{props.name+": "+value}</p>
    )
}