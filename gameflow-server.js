import { SimpleGame } from "./SimpleGame.js";
import { TicTacToe } from "./TicTacToe.js";
import { Session } from "./Session.js";
import { SocketInputHandler } from "./SocketInputHandler.js";
import { Server } from "socket.io";

const io = new Server(3000, {
    cors: {
        origin: "*"
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
    socket.on("joinGame", ({ gameType = "simple" } = {}) => {

        if (waitingPlayers[gameType]) {
            const opponent = waitingPlayers[gameType];
            delete waitingPlayers[gameType];

            const game = createGame(gameType);
            const handler1 = new SocketInputHandler(opponent);
            const handler2 = new SocketInputHandler(socket);
            const session = new Session(handler1, handler2, game);
            session.runGame();
            console.log(`GAME START: ${socket.id}, ${opponent.id}!`);
        } else {
            waitingPlayers[gameType] = socket;
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