import logo from './logo.svg';
import './App.css';
import { useDrag } from 'react-dnd';
import { r2d6 } from './utils';
import { Characteristics } from './Characteristic';


function App() {
  let stats = generateCharacteristics();
  return (

  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header> 
  //   </div>

    <div className="App">
      <Characteristics stats={stats} />
    </div>
    
  );
}

function generateCharacteristics() {
let characteristics = {
  strength: r2d6(),
  dexterity: r2d6(),
  endurance: r2d6(),
  intellect: r2d6(),
  education: r2d6(),
  social: r2d6(),
};

  return characteristics;
}

export default App;
