import { SimpleGame } from "./SimpleGame.js";
import { TicTacToe } from "./TicTacToe.js";
import { Session } from "./Session.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import path from "path";
import process from "process";
import { createServer } from "http";

const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
console.log("START");

// store one waiting socket per game type, could be extended to queues
const waitingPlayers = {};

// registry so we can create new game instances by name
const gameRegistry = {
    simple: SimpleGame,
    ticTacToe: TicTacToe
};

function createGame(type) {
    const GameClass = gameRegistry[type];
    if (!GameClass) {
        throw new Error(`Unsupported game type "${type}"`);
    }
    return new GameClass();
}

io.on("connection", (socket) => {
    console.log("CONNECTED: " + socket.id);

    // client should emit a join request specifying the kind of game
    socket.on("join_game", ({ gameType = "simple" } = {}) => {

        if (waitingPlayers[gameType]) {
            const opponent = waitingPlayers[gameType];
            delete waitingPlayers[gameType];

            const game = createGame(gameType);
            const players = [opponent, socket];
            const session = new Session(players, game, io);
            session.runGame();
        } else {
            waitingPlayers[gameType] = socket;
            socket.emit("join_status", "queued"); //notify client they have been queued
            console.log(`QUEUED: ${socket.id}, ${gameType}`);
        }
    });

    socket.on("disconnect", () => {
        // remove socket from any waiting lists
        for (const [type, ws] of Object.entries(waitingPlayers)) {
            if (ws === socket) {
                delete waitingPlayers[type];
                console.log(`LEFT QUEUE: ${socket.id}`);
                break;
            }
        }
        //middle of a game!
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'web-client.html'));
});

app.get('/gameflow_client.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'gameflow-client.js'));
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
