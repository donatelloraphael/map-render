import { useState } from 'react';
import './App.css';
import Map from './Map';
import Render from './Render';

function App() {
  const [image, setImage] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Map Render App</h1>
        <Map setImage={setImage}></Map>
        {image && <Render image={image}></Render>}

      </header>
    </div>
  );
}

export default App;
