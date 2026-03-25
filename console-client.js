import promptSync from 'prompt-sync';
import { Client } from './gameflow-client.js';
import { io } from "socket.io-client";
const prompt = promptSync();

const client = new Client("http://localhost:3000", io);

// choose which game to play
let choice = process.argv[2];
if (!choice) {
    choice = prompt("Which game would you like to play? (simple/ticTacToe) ");
}
if (choice === "ticTacToe") {
    playTicTacToe();
} else {
    playSimpleGame();
}

function playSimpleGame() {
    client.joinGame("simple");

    client.onMyTurn((status, gameState) => {
        console.log(`it's player ${status}'s turn.`);
        // ignoring gameState for simple game
        let move = prompt("what is your move? ");
        if (move === undefined) { console.log("error i was xpecting!") }
        client.takeTurn(move);
    });

    client.onGameOver((status) => {
        console.log(`player ${status} wins!`);
        client.disconnect();
    });
}

function playTicTacToe() {
    client.joinGame("ticTacToe");

    const renderBoard = (b) => {
        console.log("board:");
        for (let row of b) {
            console.log(row.map(c => c || '-').join(' '));
        }
    };

    client.onMyTurn((status, gameState) => {
        console.log(`it's player ${status}'s turn.`);
        if (gameState && gameState.board) renderBoard(gameState.board);
        const raw = prompt("enter coordinates as x,y (0-2): ");
        const [xStr, yStr] = raw.split(",");
        const move = { x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
        client.takeTurn(move);
    });

    client.onGameOver((status, gameState) => {
        console.log(`game over!`);
        if (gameState.winner == "draw") {
            console.log("it's a draw!");
        }
        else {
            console.log(`${gameState.winner} wins!`);
        }
        if (gameState && gameState.board) renderBoard(gameState.board);
        client.disconnect();
    });
}