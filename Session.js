export class Session {
    game; //GameObject instance
    players; //array of each player's socket.

    constructor(players, game) {
        this.players = players;
        this.game = game;

        this.players.forEach((player) => {
            player.emit("join_status", "begin");
        });
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
        this.players.forEach((player) => {
            player.emit("game_over", this.game.whoseMove, this.game.gameState);
        });
        console.log(`game ended.`);
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