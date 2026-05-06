import { useEffect, useState } from 'react';

// Event handlers extracted for clarity
function handleJoin(data, setStatus) {
    setStatus(data.status);
}

function handleMyTurn(setStatus) {
    setStatus("it's your turn!");
}

function handleWinner(isWinner) {
    return isWinner ? "you win!" : "you lose!";
}

function handleGameOver(outcome, setStatus) {
    switch (outcome.reason) {
        case "winner": setStatus(handleWinner(outcome.isWinner)); break;
        case "quit": setStatus("game quit by " + outcome.quitter); break;
        case "draw": setStatus("it's a draw!"); break;
    }
}

export default function SimpleGame({ client }) {
    const [move, setMove] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        client.onJoin((data) => handleJoin(data, setStatus));
        client.onMyTurn(() => handleMyTurn(setStatus));
        client.onGameOver((outcome) => handleGameOver(outcome, setStatus));
    })

    return (
        <div>
            <div>Simple Game</div><br />
            <button onClick={() => client.joinGame("simple")}>Join Game</button><br />
            <div id="status">{status}</div>
            <input type="text" value={move} onChange={(e) => setMove(e.target.value)}></input>
            <button onClick={() => client.takeTurn(move)}>Submit</button>
        </div>
    );
}