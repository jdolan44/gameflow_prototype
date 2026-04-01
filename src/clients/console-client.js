/* eslint-disable no-undef */
import promptSync from 'prompt-sync';
import { Client } from '../core/gameflow-client.js';
const prompt = promptSync();

const client = new Client("http://localhost:3000");

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

    client.onJoin((data) => {
        if (data.status === "begin") {
            console.log("Game started!");
        } else if (data.status === "queued") {
            console.log("Waiting for another player...");
        }
    });

    client.onMyTurn(() => {
        console.log(`It's your turn.`);
        // ignoring gameState for simple game
        let move = prompt("What is your move? ");
        client.takeTurn(move);
    });

    client.onGameOver((data) => {
        if (client.isWinner(data)) {
            console.log("You win!");
        } else {
            console.log("You lose!");
        }
        client.disconnect();
    });
}

function playTicTacToe() {
    client.joinGame("ticTacToe");

    client.onJoin((data) => {
        if (data.status === "begin") {
            console.log("Game started!");
        } else if (data.status === "queued") {
            console.log("Waiting for another player...");
        }
    });

    const renderBoard = (b) => {
        console.log("board:");
        for (let row of b) {
            console.log(row.map(c => c || '-').join(' '));
        }
    };

    client.onMyTurn((data) => {
        console.log(`It's your turn.`);
        if (data.state && data.state.board) renderBoard(data.state.board);
        const raw = prompt("Enter coordinates as x,y (0-2): ");
        const [xStr, yStr] = raw.split(",");
        const move = { x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
        client.takeTurn(move);
    });

    client.onGameOver((data) => {
        console.log(`Game over!`);
        if (data.state && data.state.board) renderBoard(data.state.board);
        if (client.isWinner(data)) {
            console.log("You win!");
        } else {
            console.log("You lose!");
        }
        client.disconnect();
    });
}