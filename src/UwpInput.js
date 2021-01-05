import { num2tetra } from './utils';
import './UwpInput.css';

export function UwpInput({value}) {
    return (
        <div className="UwpInput">
            <input className="UWPValue" type="text" value={num2tetra(value)} />
            <div className="IncDec">
                <input className="Inc" type="button" value="▲" />
                <input className="Dec" type="button" value="▼" />
            </div>
        </div>
    );
}