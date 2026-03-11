import { SimpleGame } from "./SimpleGame.js";
import { TicTacToe } from "./TicTacToe.js";
import { Session } from "./Session.js";
import { SocketInputHandler } from "./SocketInputHandler.js";
import { Server } from "socket.io";

const io = new Server(3000);

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
    console.log("player connected! " + socket.id);

    // client should emit a join request specifying the kind of game
    socket.on("joinGame", ({ gameType = "simple" } = {}) => {
        console.log(`socket ${socket.id} is looking for a ${gameType} game`);

        if (waitingPlayers[gameType]) {
            const opponent = waitingPlayers[gameType];
            delete waitingPlayers[gameType];

            const game = createGame(gameType);
            const handler1 = new SocketInputHandler(opponent);
            const handler2 = new SocketInputHandler(socket);
            const session = new Session(handler1, handler2, game);
            session.runGame();
        } else {
            waitingPlayers[gameType] = socket;
        }
    });

    socket.on("disconnect", () => {
        // remove socket from any waiting lists
        for (const [type, ws] of Object.entries(waitingPlayers)) {
            if (ws === socket) {
                delete waitingPlayers[type];
                break;
            }
        }
    });
});