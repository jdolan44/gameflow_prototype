import { io } from "http://localhost:3000/socket.io/socket.io.esm.min.js";

export class Client {
    constructor(host/*, io*/) { //takes location of host server
        this.socket = io(host);
        this.sessionID = null;
        this.handleMyTurn = () => { };
        this.handleInvalidTurn = () => { };
        this.handleWinner = () => { };
        this.handleQuit = () => { };
        this.currentTurnData = null;

        //handles trigger for my turn
        this.socket.on("state_update", (data) => {
            if (data.whoseMove === this.socket.id) {
                this.currentTurnData = data;
                this.handleMyTurn(data);
            }
        });
        // re-trigger turn handling on invalid move
        this.socket.on("action_result", ({ success, error }) => {
            if (success === false) {
                this.handleInvalidTurn(error);
                this.handleMyTurn(this.currentTurnData);
            }
        })

        this.socket.on("game_end", (data) => {
            switch (data.reason) {
                case "quit":
                    this.handleQuit(data);
                    break;
                case "win":
                    this.handleWinner(data);
            }
        });
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
        this.socket.on("join_status", (data) => {
            if (data.status === "begin") {
                this.sessionID = data.sessionID;
            }
            handleJoin(data);
        });
    }

    onMyTurn(handleMyTurn) {
        this.handleMyTurn = handleMyTurn;
    }

    onInvalidTurn(handleInvalidTurn) {
        this.handleInvalidTurn = handleInvalidTurn;
    }

    takeTurn(move) {
        this.socket.emit("game_message", { type: "take_turn", payload: { move }, sessionID: this.sessionID });
    }

    onWinner(handleWinner) {
        //this.socket.on("game_end", handleGameOver);
        this.handleWinner = handleWinner;
    }

    //TODO: modify this so client doesn't have to know if it's the winner
    isWinner(gameOverData) {
        return gameOverData.winner === this.socket.id;
    }

    //for when a game disconnects/abruptly ends.
    onQuit(handleQuit) {
        this.handleQuit = handleQuit;
    }
}