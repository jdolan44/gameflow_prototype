import { io } from "socket.io-client";
import promptSync from 'prompt-sync';
const prompt = promptSync();

const socket = io("http://localhost:3000");

// choose which game to play
const choice = prompt("Which game would you like to play? (simple/ticTacToe) ");
if (choice === "ticTacToe") {
    playTicTacToe();
} else {
    playSimpleGame();
}

function playSimpleGame() {
    socket.emit("joinGame", { gameType: "simple" });

    socket.on("request_move", (status, gameState, callback) => {
        console.log(`it's player ${status}'s turn.`);
        // ignoring gameState for simple game
        let move = prompt("what is your move? ");
        callback({
            move: move
        });
    });

    socket.on("game_over", (status) => {
        console.log(`player ${status} wins!`);
        socket.disconnect();
    });
}

function playTicTacToe() {
    socket.emit("joinGame", { gameType: "ticTacToe" });

    const renderBoard = (b) => {
        console.log("board:");
        for (let row of b) {
            console.log(row.map(c => c || '-').join(' '));
        }
    };

    socket.on("request_move", (status, gameState, callback) => {
        console.log(`it's player ${status}'s turn.`);
        if (gameState && gameState.board) renderBoard(gameState.board);
        const raw = prompt("enter coordinates as x,y (0-2): ");
        const [xStr, yStr] = raw.split(",");
        const move = { x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
        callback({ move });
    });

    socket.on("game_over", (status, gameState) => {
        console.log(`game over; player ${status} wins or it's a draw!`);
        if (gameState && gameState.board) renderBoard(gameState.board);
        socket.disconnect();
    });
}