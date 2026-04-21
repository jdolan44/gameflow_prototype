export class Session {
    /**@type {GameObject} */
    game; //GameObject instance
    /**@type {Socket[]} */
    players; //array of each player's socket.
    /**@type {string} */
    sessionID; //ID of the socket.io room created for this game.
    io; //Socket.IO server instance

    constructor(players, game, io, onGameEnd) {
        this.players = players;
        this.game = game;
        this.io = io;
        this.sessionID = players.map(p => p.id).join("-");
        this.onGameEnd = onGameEnd;

        // Join players to the room
        this.players.forEach((player) => {
            player.join(this.sessionID);
        });

        //log game start
        console.log(`GAME START: ${this.sessionID},`);
        console.log(this.game.gameState);

        // Emit to everyone in the room
        this.sendToRoom("join_status", { status: "begin", sessionID: this.sessionID });

        //send initial state update
        this.sendToRoom("state_update", { state: this.game.gameState, whoseMove: this.getCurrentPlayer() });
    }

    getSessionId() {
        return this.sessionID;
    }

    getCurrentPlayer() {
        return this.players[this.game.whoseMove - 1].id
    }

    //handles a game message from a given socket.
    //message will be in format: {type, payload}.
    handleMessage(socket, msg) {
        switch (msg.type) {
            case "take_turn":
                this.handleTurn(socket, msg.payload.move);
                break;
            case "quit_game":
                this.handleGameOver({ type: "quit", quitter: socket });
                this.sendActionResult(socket, true);
                break;
            default:
                this.sendActionResult(socket, false, "message type not recognized!");
        }
    }

    //handles a turn recieved from a player.
    //sends an "action_result" event.
    handleTurn(socket, move) {
        console.log(move);
        //verify it is this player's turn.
        if (socket.id != this.getCurrentPlayer()) {
            this.sendActionResult(socket, false, "not your turn!");
            return;
        }

        //validate if the turn is valid
        if (!this.game.isValidTurn(move, this.game.gameState)) {
            this.sendActionResult(socket, false, "invalid turn!");
            return;
        }

        //tell player their turn was valid
        this.sendActionResult(socket);
        //apply turn
        this.game.takeTurn(move, this.game.gameState);

        //check for game over
        const outcome = this.game.checkGameOver(this.game.gameState);
        if (outcome) {
            this.handleGameOver(outcome);
            return;
        }

        //move to next player
        this.game.nextPlayer();
        //emit the state update to everyone
        this.sendToRoom("state_update", { state: this.game.gameState, whoseMove: this.getCurrentPlayer() });

    }

    handleGameOver(outcome) {
        const gameEndData = {
            reason: outcome.type,
            state: this.game.gameState
        };

        if (outcome.type === 'winner') {
            gameEndData.winner = this.players[outcome.winner - 1].id;
        }

        if (outcome.type === 'quit') {
            gameEndData.quitter = outcome.quitter.id;
        }

        this.players.forEach((player, index) => {
            //TODO: what if it's not a win event? i think it's okay though.
            gameEndData.isWinner = (index == outcome.winner - 1);
            player.emit("game_end", gameEndData);
        });

        console.log(`GAME END: ${this.sessionID}`);
        this.onGameEnd(this.sessionID);
    }

    sendActionResult(socket, success = true, error = "") {
        if (!success) console.log(socket.id + " error: " + error);
        else console.log(socket.id + " action success!");
        socket.emit("action_result", { success, error });
    }

    sendToRoom(type, payload) {
        this.io.to(this.sessionID).emit(type, payload);
    }

}