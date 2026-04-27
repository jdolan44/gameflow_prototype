import { useState } from 'react'
import { Client } from 'gameflow-client'
import './App.css'

// Create client OUTSIDE the component to prevent multiple socket connections
const client = new Client("http://localhost:3000");

// Register handlers ONCE outside the component
client.onJoin((data) => {
  console.log(data);
});

client.onMyTurn(() => {
  let turn = window.prompt("what's your turn?");
  client.takeTurn(turn);
});

client.onGameOver((outcome) => {
  switch (outcome.reason) {
    case "winner": handleWinner(outcome.isWinner); break;
    case "quit": handleQuit(outcome.quitter); break;
    case "draw": handleDraw(); break;
  }
});

function App() {
  return (
    <>
      <button onClick={() => joinGame(client)}>Join Game</button>
    </>
  )
}

function joinGame(client) {
  client.joinGame("simple");
}

function handleWinner(isWinner) {
  if (isWinner) window.alert("you win!");
  else window.alert("you lose!");
}

function handleQuit(quitter) {
  window.alert("game quit by " + quitter);
}

function handleDraw() {
  window.alert("it's a draw!");
}

export default App
