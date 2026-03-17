import { io } from "socket.io-client";
export class Client {
    constructor(host) { //takes location of host server
        this.socket = io(host);
    }

    joinGame(gameType) {
        this.socket.emit("joinGame", { gameType });
    }

    disconnect() {
        this.socket.disconnect();
    }
    //maybe add function for getting current game type connected?

    onJoin() {

    }

    //the method handleMove should return the move being made.
    onTurn(handleMove) {
        this.socket.on("request_move", (status, gameState, callback) => {
            let move = handleMove(status, gameState);
            callback({ move });
        });
    }


    //when an invalid turn is recieved. 
    //TO BE IMPLEMENTED!!
    onInvalidTurn() {

    }

    onGameOver(handleGameOver) {
        this.socket.on("game_over", handleGameOver);
    }

    //for when a game disconnects/abruptly ends.
    onDisconnect() {

    }
}