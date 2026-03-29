//import { io } from "socket.io-client";
//issue: the console client needs the above line. The web client can't have it!
export class Client {
    //remove taking an io as input later
    constructor(host) { //takes location of host server
        this.socket = io(host);
    }
    /**
     * Requests to join a game. 
     * @param {string} gameType the string identifier of the game to join.
     */
    joinGame(gameType) {
        this.socket.emit("join_game", { gameType });
    }

    disconnect() {
        this.socket.disconnect();
    }

    onJoin(handleJoin) {
        this.socket.on("join_status", handleJoin);
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