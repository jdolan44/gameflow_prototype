import './App.css'
import TTT from './TTT';
import SimpleGame from './SimpleGame'
import { useState } from 'react';

import { Client } from 'gameflow-client';

const client = new Client("http://localhost:3000");

function App() {
  const [choice, setChoice] = useState("");

  switch (choice) {
    case "ttt": return <TTT client={client} />
    case "simple": return <SimpleGame client={client} />
    default: return (
      <div>
        <h2>Select a game:</h2>
        <div id="select">
          <button onClick={() => setChoice("simple")}>Simple Game</button>
          <button onClick={() => setChoice("ttt")}>Tic Tac Toe</button>
        </div >
      </div >
    )
  }
}

export default App
