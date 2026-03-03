import { SimpleGame } from "./SimpleGame.js";
import { Session } from "./Session.js";
import { SocketInputHandler } from "./SocketInputHandler.js";
import { Server } from "socket.io";
const io = new Server(3000);
let waitingPlayer = null;
io.on("connection", (socket) => {
    console.log("player connected! " + socket.id);

    if (waitingPlayer) {
        let game = new SimpleGame();
        let handler1 = new SocketInputHandler(waitingPlayer);
        let handler2 = new SocketInputHandler(socket);
        let session = new Session(handler1, handler2, game);
        session.runGame();
        waitingPlayer = null;
    }
    else {
        waitingPlayer = socket;
    }
});