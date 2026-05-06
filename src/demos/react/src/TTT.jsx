import { useState, useEffect } from "react";
import TTTBoard from "./TTTBoard"

function handleMyTurn(setStatus, setMyTurn) {
    setStatus("it's your turn!");
    setMyTurn(true);
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

function TTT({ client }) {
    const [board, setBoard] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ])
    const [myTurn, setMyTurn] = useState(false)
    const [status, setStatus] = useState("")

    useEffect(() => {
        client.onJoin((data) => setStatus(data.status));
        client.onMyTurn(() => handleMyTurn(setStatus, setMyTurn));
        client.onStateUpdate((gameState) => setBoard(gameState.board));
        client.onGameOver((outcome) => handleGameOver(outcome, setStatus));
    })

    function handleCellClick({ x, y }) {
        if (myTurn) {
            client.takeTurn({ x, y });
            setMyTurn(false);
        }
    }

    return (
        <>
            <section>
                <h1>Tic Tac Toe</h1>
                <button onClick={() => client.joinGame("ticTacToe")}>Join Game</button>
                <div>{status}</div>
            </section>
            <TTTBoard board={board} myTurn={myTurn} onCellClick={handleCellClick} />
        </>
    )
}

export default TTT