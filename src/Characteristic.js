import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { num2tetra } from "./utils";

import './Characteristic.css';
import { ItemTypes } from "./constants";


let test = 0;

export function Characteristics({characteristics, updateCharacteristics}) {
    let stats = [];

    for (let char in characteristics) {
        if (characteristics.hasOwnProperty(char)) {
            stats.push(<Characteristic name={char} value={characteristics[char]} updateCharacteristics={updateCharacteristics} />);
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="Characteristics">
                {stats}
            </div>
        </DndProvider>
    )
}

export function Characteristic({name, value, updateCharacteristics}) {
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CHARACTERISTIC, name: name, value: value },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });
    const [{ isOver, }, drop] = useDrop({
        accept: ItemTypes.CHARACTERISTIC,
        drop: ({name: dropName, value: dropValue}) => {
            let newchars = {};
            newchars[dropName] = value;
            newchars[name] = dropValue;
            updateCharacteristics(newchars);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    const displayValue = num2tetra(value);

    return (
        <div ref={drop} className="Characteristic">
            <p className="Name">{name}</p>
            <div ref={drag} className="CharacteristicValue">
                <p className="Value">{displayValue}</p>
            </div>
        </div>
    );
}