import { io } from "socket.io-client";

/**
 * @class
 */
export class Client {
    /**
     * Creates a new Gameflow Client.
     * @param {String} host location of the host server.
     */
    constructor(host) {
        this.defaultHandler = () => { };
        /**@type {Socket} */
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
                    this.callHandler('state_update', data.state);
                    if (data.whoseMove === this.socket.id) {
                        this.currentTurnData = data.state;
                        this.callHandler('myTurn', data.state);
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
                case "game_end":
                    //fire one last state update
                    this.callHandler('state_update', data.state);
                    this.callHandler(event, data);
                    break;
                default:
                    this.callHandler(event, data);
            }
        });
    }

    /**
     * Calls the specified handler.
     * @private
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


    /**
     * sends a turn to the server. `move` specifies the payload of the turn.
     * @param {Object} move 
     */
    takeTurn(move) {
        this.socket.emit("game_message", { type: "take_turn", payload: { move }, sessionID: this.sessionID });
    }

    /**
     * disconnects this client.
     */
    disconnect() {
        this.socket.disconnect();
    }

    //EVENT HANDLERS

    /**
     * adds `handleJoin` as an event listener for joins.
     * `joinData.status` contains the type of join event (ex. `queued`, `begin`)
     * @param {(joinData:Object) => void} handleJoin 
     */
    onJoin(handleJoin) {
        this.handlers.join = handleJoin;
    }

    /**
     * adds `handleStateUpdate` as an event listener for state updates. 
     * `gameState` is the latest state of the connected game.
     * @param {(gameState:Object) => void} handleStateUpdate
     */
    onStateUpdate(handleStateUpdate) {
        this.handlers.state_update = handleStateUpdate;
    }

    /**
     * adds `handleMyTurn` as an event listener when it is this player's turn.
     * `gameState` is the latest state of the connected game.
     * @param {(gameState:Object) => void} handleMyTurn 
     */
    onMyTurn(handleMyTurn) {
        this.handlers.myTurn = handleMyTurn;
    }

    /**
     * adds `handleInvalidTurn` as an event listener for when the player sends an invalid turn.
     * `message` is an error message related to the type of invalid turn.
     * @param {(message:string) => void} handleInvalidTurn 
     */
    onInvalidTurn(handleInvalidTurn) {
        this.handlers.invalidTurn = handleInvalidTurn;
    }

    /**
     * adds `handleGameOver` as an event listener for when the game ends.
     * `outcome` contains information about the outcome of a game.
     * @param {(outcome:Object) => void} handleGameOver 
     */
    onGameOver(handleGameOver) {
        this.handlers.game_end = handleGameOver;
    }
}