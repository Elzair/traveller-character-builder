import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { num2tetra } from "./utils";

import './UPP.css';
import { ItemTypes } from "./constants";

export function UPP({options, updateOptions, characteristics, updateUPP, display, onFinalized, updateLog}) {
    function finalizeCharacteristics(ev) {
        let upp = Object.entries(characteristics).map(ent => num2tetra(ent[1])).join('');
        updateLog([`Your Universal Personality Profile is ${upp}.`])
        updateOptions({ rearrangeCharacteristics: false });
        onFinalized();
    }

    let stats = [];

    for (let char in characteristics) {
        if (characteristics.hasOwnProperty(char)) {
            if (options.rearrangeCharacteristics) {
                stats.push(<CharacteristicEditable name={char} value={characteristics[char]} updateUPP={updateUPP} />);
            } else {
                stats.push(<Characteristic name={char} value={characteristics[char]} updateUPP={updateUPP} />);
            }
        }
    }

    if (options.rearrangeCharacteristics) {
        return (
            <div className="UPPOuter">
            <DndProvider backend={HTML5Backend}>
                <div className="UPP">
                    {stats}
                </div>
            </DndProvider>
            {display && <input type="button" value="Finalize" onClick={finalizeCharacteristics} />}
            </div>
        );
    } else {
        return (
            <div className="UPPOuter">
            <div className="UPP">
                {stats}
            </div>
            {display && <input type="button" value="Finalize" onClick={finalizeCharacteristics} />}
            </div>
        );
    }
}

function Characteristic({ name, value, updateUPP }) {
    const displayValue = num2tetra(value);

    return (
        <div className="Characteristic">
            <p className="Name">{name}</p>
            <div className="CharacteristicValue">
                <p className="Value">{displayValue}</p>
            </div>
        </div>
    );
}

function CharacteristicEditable({name, value, updateUPP}) {
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
            updateUPP(newchars);
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