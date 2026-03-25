//import { io } from "socket.io-client";
//issue: the console client needs the above line. The web client can't have it!
export class Client {
    //remove taking an io as input later
    constructor(host, io) { //takes location of host server
        this.socket = io(host);
    }
    /**
     * Requests to join a game. 
     * @param {string} gameType the string identifier of the game to join.
     */
    joinGame(gameType) {
        this.socket.emit("joinGame", { gameType });
        //future update: let the client know it joined successfully?
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