import logo from './logo.svg';
import './App.css';
import { useDrag } from 'react-dnd';
import { r2d6 } from './utils';
import { Characteristics } from './Characteristic';
import { useState } from 'react';
import { Homeworld } from './Homeworld';


function App() {
  // let stats = generateCharacteristics();
  let [characteristics, setCharacteristics] = useState(generateUPP());
  let [homeworldName, setHomeworldName] = useState('');
  let [homeworldUPP, setHomeworldUPP] = useState(generateUWP());

  function updateUPP(updated) {
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
      <Characteristics characteristics={characteristics} updateUPP={updateUPP} />
      <Homeworld name={homeworldName} updateName={setHomeworldName} upp={homeworldUPP} updateUPP={setHomeworldUPP} />
    </div>
    
  );
}

function generateUPP() {
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

function generateUWP() {
  return {
    Starport: 8, 
    Size: 8,
    Atmosphere: 8,
    Hydrographics: 8,
    Population: 8,
    Government: 8,
    LawLevel: 8,
    TechLevel: 8,
  };
}

export default App;
