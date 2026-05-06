import { createServer } from "http";
import { Server } from "socket.io";
import { Session } from "./Session.js";
import { log } from "./logger.js";

export function createGameServer(options = {}) {
    //unpack options
    const {
        httpServer,
        port = 3000,
        gameRegistry = {},
        cors,
    } = options;

    //configure server
    const server = httpServer || createServer();
    const io = new Server(server, {
        cors,
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
        }
    });

    //dict of all waiting players
    const waitingPlayers = {};

    //dict of all game sessions
    /** @type {{string: Session}} */
    const sessions = {};

    function createGame(type) {
        const GameClass = gameRegistry[type];
        if (!GameClass) {
            throw new Error(`Unsupported game type "${type}"`);
        }
        return new GameClass();
    }

    io.on("connection", (socket) => {
        log("info", "CONNECTED", { socket: socket.id });

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
                log("info", "QUEUED", { socket: socket.id, gameType })
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
                    log("info", "LEFT QUEUE", { socket: socket.id });
                    return;
                }
            }
            log("info", "DISCONNECT", { socket: socket.id });
        });
    });

    function start() {
        if (!httpServer) {
            server.listen(port, () => {
                log("info", "START", { port: port });
            });
        }
    }

    return { io, server, start }
}