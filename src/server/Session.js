export class Session {
    game; //GameObject instance
    players; //array of each player's socket.
    roomID; //ID of the socket.io room created for this game.
    io; //Socket.IO server instance

    constructor(players, game, io) {
        this.players = players;
        this.game = game;
        this.io = io;
        this.roomID = players.map(p => p.id).join("-");

        // Join players to the room
        this.players.forEach((player) => {
            player.join(this.roomID);
        });

        //log game start
        console.log(`GAME START: ${this.roomID}`);

        // Emit to everyone in the room
        this.io.to(this.roomID).emit("join_status", { status: "begin", sessionID: this.roomID });

        //send initial state update
        this.io.to(this.roomID).emit("state_update", { state: this.game.gameState, whoseMove: this.players[this.game.whoseMove - 1].id });
    }

    getId() {
        return this.roomID;
    }

    handleGameOver() {
        this.io.to(this.roomID).emit("game_over", { winner: this.players[this.game.whoseMove - 1].id, state: this.game.gameState });
        console.log(`GAME END: ${this.roomID}`);
    }

    //handles a game message from a given socket.
    //message will be in format: {type, payload}.
    handleMessage(socket, msg) {
        switch (msg.type) {
            case "take_turn":
                this.handleTurn(socket, msg.payload.move);
                break;
            default:
                this.sendActionResult(socket, false, "message type not recognized!");
        }
    }

    //handles a turn recieved from a player.
    //sends an "action_result" event.
    //TODO: async?
    handleTurn(socket, move) {
        console.log(move);
        //verify it is this player's turn.
        if (socket.id != this.players[this.game.whoseMove - 1].id) {
            //TODO: make action results its own function
            this.sendActionResult(socket, false, "not your turn!");
            return;
        }

        //validate if the turn is valid
        if (!this.game.isValidTurn(move, this.game.gameState)) {
            this.sendActionResult(socket, false, "invalid turn!");
            return;
        }

        //tell player their turn was valid
        socket.emit("action_result", { success: true });
        //apply turn
        this.game.takeTurn(move, this.game.gameState);

        //check for winner
        if (this.game.checkWinner(this.game.gameState)) {
            this.handleGameOver();
            return;
        }

        //move to next player
        this.game.nextPlayer();
        //emit the state update to everyone
        //TODO: make a state update function
        this.io.to(this.roomID).emit("state_update", { state: this.game.gameState, whoseMove: this.players[this.game.whoseMove - 1].id });


    }

    sendActionResult(socket, success = true, error = "") {
        if (!success) console.log(socket.id + " error: " + error);
        else console.log(socket.id + " turn success!");
        socket.emit("action_result", { success, error });
    }

}