import { io } from "socket.io-client";
export class Client {
    constructor(host) { //takes location of host server
        const socket = io(host);
    }

    joinGame(gameType) {
        socket.emit("joinGame", { gameType });
    }

    disconnect() {
        socket.disconnect();
    }
    //maybe add function for getting current game type connected?

    onJoin() {

    }

    //the method handleMove should return the move being made.
    onTurn(handleMove) {
        socket.on("request_move", (status, gameState, callback) => {
            let move = handleMove(status, gameState);
            callback({ move });
        });
    }


    //when an invalid turn is recieved. 
    //TO BE IMPLEMENTED!!
    onInvalidTurn() {

    }

    onGameOver(handleGameOver) {
        socket.on("game_over", handleGameOver);
    }

    //for when a game disconnects/abruptly ends.
    onDisconnect() {

    }
}