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
        this.io.to(this.roomID).emit("join_status", "begin");
    }

    async runGame() {
        let winner = null;
        do {
            this.game.nextPlayer();
            let move = await this.getMove();
            this.game.takeTurn(move, this.game.gameState);
            winner = this.game.checkWinner(this.game.gameState); //what if it's a draw?
        } while (!winner);
        this.handleGameOver();
    }

    handleGameOver() {
        this.io.to(this.roomID).emit("game_over", this.game.whoseMove, this.game.gameState);
        console.log(`GAME END: ${this.roomID}`);
    }

    //ew
    async getMove() {
        let move = null;
        const currentPlayer = this.players[this.game.whoseMove - 1];
        do {
            currentPlayer.emit('request_move', this.game.whoseMove, this.game.gameState);
            move = await new Promise((resolve) => {
                currentPlayer.on("take_turn", (move) => {
                    resolve(move);
                });
            });
            console.log(move);
        } while (!this.game.isValidTurn(move, this.game.gameState));
        return move;
    }


}