import { SimpleGame } from "../games/SimpleGame.js";
import { TicTacToe } from "../games/TicTacToe.js";
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
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
    }
});
console.log("START");

//TODO: change a lot of these to maps?

// store one waiting socket per game type, could be extended to queues
const waitingPlayers = {};

//dict of all game sessions
/** @type {{string: Session}} */
const sessions = {};

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
            const session = new Session(players, game, io, (sessionID) => {
                delete sessions[sessionID];
            });
            sessions[session.getSessionId()] = session;
        } else {
            waitingPlayers[gameType] = socket;
            socket.emit("join_status", { status: "queued" }); //notify client they have been queued
            console.log(`QUEUED: ${socket.id}, ${gameType}`);
        }
    });

    socket.on("game_message", (msg) => {
        if (sessions[msg.sessionID]) {
            sessions[msg.sessionID].handleMessage(socket, msg);
        }
        else {
            socket.emit("action_result", { success: false, error: "session no longer exists!" });
        }
    });

    socket.on("disconnect", () => {
        // remove socket from any waiting lists
        for (const [type, ws] of Object.entries(waitingPlayers)) {
            if (ws === socket) {
                delete waitingPlayers[type];
                console.log(`LEFT QUEUE: ${socket.id}`);
                return;
            }
        }
        console.log(`DISCONNECT: ${socket.id}`);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/clients/web-client.html'));
});

app.get('/web-client.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/clients/web-client.js'));
});

app.get('/gameflow_client.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/core/gameflow-client.js'));
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
