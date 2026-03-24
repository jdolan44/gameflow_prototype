//import { io } from "socket.io-client";
//issue: the console client needs the above line. The web client can't have it!
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

    onMyTurn(handleMyTurn) {
        this.socket.on("request_move", handleMyTurn);
    }

    takeTurn(move) {
        this.socket.emit("take_turn", move);
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