import { Client } from 'gameflow-client'
import './App.css'
import { useEffect, useState } from 'react';

// Create client OUTSIDE the component to prevent multiple socket connections
const client = new Client("http://localhost:3000");

function App() {
  const [move, setMove] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    client.onJoin((data) => {
      setStatus(data.status);
    });

    client.onMyTurn(() => {
      setStatus("it's your turn!");
    });

    client.onGameOver((outcome) => {
      switch (outcome.reason) {
        case "winner": handleWinner(outcome.isWinner, setStatus); break;
        case "quit": handleQuit(outcome.quitter); break;
        case "draw": handleDraw(); break;
      }
    });
  })

  return (
    <>
      <div>
        <div>Simple Game</div><br />
        <button onClick={() => joinGame(client)}>Join Game</button><br />
        <div id="status">{status}</div>
        <input type="text" value={move} onChange={(e) => setMove(e.target.value)}></input>
        <button onClick={() => client.takeTurn(move)}>Submit</button>
      </div>
    </>
  )
}

function joinGame(client) {
  client.joinGame("simple");
}

function handleWinner(isWinner, setStatus) {
  if (isWinner) setStatus("you win!");
  else setStatus("you lose!");
}

function handleQuit(quitter, setStatus) {
  setStatus("game quit by " + quitter);
}

function handleDraw(setStatus) {
  setStatus("it's a draw!");
}

export default App
