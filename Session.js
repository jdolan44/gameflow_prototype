export class Session {
    game; //GameObject instance
    playerInputHandlers; //array of each player's input handlers.

    constructor(player1Handler, player2Handler, game) {
        this.playerInputHandlers = [player1Handler, player2Handler];
        this.game = game;
    }

    async runGame() {
        let winner = null;
        do {
            this.game.nextPlayer();
            let move = await this.getMove();
            this.game.takeTurn(move, this.game.gameState);
            winner = this.game.checkWinner(this.game.gameState); //what if it's a draw?
        } while (!winner);
        this.playerInputHandlers.forEach((handler) => {
            handler.emitGameOver(this.game.whoseMove, this.game.gameState);
        });
        //console.log(`game ended between ${this.players[0]} and ${this.players[1]}.`);
        console.log(`game ended.`);
    }

    async getMove() {
        let move = null;
        const handler = this.playerInputHandlers[this.game.whoseMove - 1];
        do {
            //how does the user get feedback on invalid turn?
            move = await handler.requestMove(this.game.whoseMove, this.game.gameState);
            console.log(move);
        } while (!this.game.isValidTurn(move, this.game.gameState));
        return move;
    }
}