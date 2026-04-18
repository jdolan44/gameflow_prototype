import { io } from "http://localhost:3000/socket.io/socket.io.esm.min.js";

export class Client {
    constructor(host/*, io*/) { //takes location of host server
        this.defaultHandler = () => { };
        this.socket = io(host);
        this.sessionID = null;
        this.handlers = {
            myTurn: this.defaultHandler,
            invalidTurn: this.defaultHandler,
            winner: this.defaultHandler,
            quit: this.defaultHandler,
            join: this.defaultHandler
        };
        this.currentTurnData = null;

        this.socket.onAny((event, data) => {
            console.log(event);
            switch (event) {
                case "state_update":
                    if (data.whoseMove === this.socket.id) {
                        this.currentTurnData = data;
                        this.callHandler('myTurn', data);
                    }
                    break;
                case "action_result":
                    //TODO: possible flaw: action results can be for other things (not your move)
                    if (data.success === false) {
                        this.callHandler('invalidTurn', data.error);
                        this.callHandler('myTurn', this.currentTurnData);
                    }
                    break;
                case "game_end":
                    this.callHandler(data.reason, data);
                    break;
                case "join_status":
                    if (data.status === "begin") {
                        this.sessionID = data.sessionID;
                    }
                    this.callHandler('join', data);
                    break;
                default:
                    if (this.handlers[event] && this.handlers[event] !== this.defaultHandler) {
                        this.handlers[event](data);
                    } else {
                        console.warn(`Event ${event} not handled`);
                    }
            }
        });
    }

    callHandler(key, data) {
        if (!this.handlers[key]) {
            console.warn(`${key} handler does not exist`);
        }
        else if (this.handlers[key] === this.defaultHandler) {
            console.warn(`${key} handler not implemented`);
        } else {
            this.handlers[key](data);
        }
    }

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

    disconnect() {
        this.socket.disconnect();
    }

    onJoin(handleJoin) {
        this.handlers.join = handleJoin;
    }

    onMyTurn(handleMyTurn) {
        this.handlers.myTurn = handleMyTurn;
    }

    onInvalidTurn(handleInvalidTurn) {
        this.handlers.invalidTurn = handleInvalidTurn;
    }

    takeTurn(move) {
        this.socket.emit("game_message", { type: "take_turn", payload: { move }, sessionID: this.sessionID });
    }

    onWinner(handleWinner) {
        this.handlers.winner = handleWinner;
    }

    //TODO: modify this so client doesn't have to know if it's the winner
    isWinner(gameOverData) {
        return gameOverData.winner === this.socket.id;
    }

    onQuit(handleQuit) {
        this.handlers.quit = handleQuit;
    }
}