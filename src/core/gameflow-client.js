//TODO: only works if client and server are on the same port
import { io } from "./socket.io/socket.io.esm.min.js";

export class Client {
    /**
     * Creates a new Gameflow Client.
     * @param {String} host location of the host server.
     */
    constructor(host) {
        this.defaultHandler = () => { };
        this.socket = io(host);
        this.sessionID = null;
        this.handlers = {
            myTurn: this.defaultHandler,
            invalidTurn: this.defaultHandler,
            join: this.defaultHandler,
            state_update: this.defaultHandler
        };
        this.currentTurnData = null;

        this.socket.onAny((event, data) => {
            switch (event) {
                case "state_update":
                    this.callHandler('state_update', data);
                    if (data.whoseMove === this.socket.id) {
                        this.currentTurnData = data;
                        this.callHandler('myTurn', data);
                    }
                    break;
                case "action_result":
                    //TODO: handle all action result cases, not just invalid turn
                    if (data.success === false) {
                        this.callHandler('invalidTurn', data.error);
                        this.callHandler('myTurn', this.currentTurnData);
                    }
                    break;
                case "join_status":
                    if (data.status === "begin") {
                        this.sessionID = data.sessionID;
                    }
                    this.callHandler('join', data);
                    break;
                default:
                    this.callHandler(event, data);
            }
        });
    }

    /**
     * Calls the specified handler. Internal use only.
     * @param {String} key name of the event handler.
     * @param {Object} data payload of the event handler.
     */
    callHandler(key, data) {
        if (!this.handlers[key]) {
            console.warn(`${key} handler does not exist.`);
        }
        else if (this.handlers[key] === this.defaultHandler) {
            console.warn(`${key} handler not implemented.`);
        } else {
            this.handlers[key](data);
        }
    }

    //EVENT EMITTERS

    /**
     * Requests to join a game. 
     * @param {string} gameType the string identifier of the game to join.
     */
    joinGame(gameType) {
        this.socket.emit("join_game", { gameType });
    }

    /**
     * Quits the currently joined game.
     */
    quitGame() {
        this.socket.emit("game_message", { type: "quit_game", payload: {}, sessionID: this.sessionID });
    }


    takeTurn(move) {
        this.socket.emit("game_message", { type: "take_turn", payload: { move }, sessionID: this.sessionID });
    }

    disconnect() {
        this.socket.disconnect();
    }

    //EVENT HANDLERS

    onJoin(handleJoin) {
        this.handlers.join = handleJoin;
    }

    onStateUpdate(handleStateUpdate) {
        this.handlers.state_update = handleStateUpdate;
    }

    onMyTurn(handleMyTurn) {
        this.handlers.myTurn = handleMyTurn;
    }

    onInvalidTurn(handleInvalidTurn) {
        this.handlers.invalidTurn = handleInvalidTurn;
    }

    onGameOver(handleGameOver) {
        this.handlers.game_end = handleGameOver;
    }

    //TODO: modify this so client doesn't have to know if it's the winner
    isWinner(gameOverData) {
        return gameOverData.winner === this.socket.id;
    }
}