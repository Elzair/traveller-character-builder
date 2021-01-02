import logo from './logo.svg';
import './App.css';
import { useDrag } from 'react-dnd';
import { r2d6 } from './utils';
import { Characteristics } from './Characteristic';
import { useState } from 'react';




function App() {
  // let stats = generateCharacteristics();
  let [characteristics, setCharacteristics] = useState(generateCharacteristics());

  function updateCharacteristics(updated) {
    let newchars = {};
    for (let char in characteristics) {
      if (characteristics.hasOwnProperty(char)) {
        newchars[char] = characteristics[char];
      }
    }

    for (let char in updated) {
      if (updated.hasOwnProperty(char)) {
        newchars[char] = updated[char];
      }
    }

    setCharacteristics(newchars);
  }

  return (
    <div className="App">
      <Characteristics characteristics={characteristics} updateCharacteristics={updateCharacteristics} />
    </div>
    
  );
}

function generateCharacteristics() {
  let characteristics = {
    Strength: r2d6(),
    Dexterity: r2d6(),
    Endurance: r2d6(),
    Intellect: r2d6(),
    Education: r2d6(),
    Social: r2d6(),
  };

  return characteristics;
}

export default App;
