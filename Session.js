import { ConsoleInputHandler } from "./ConsoleInputHandler.js";
export class Session {
    game; //GameObject instance
    inputHandler;
    players;

    constructor(player1, player2, game, inputHandler = new ConsoleInputHandler()) {
        this.players = [player1, player2];
        this.inputHandler = inputHandler;
        this.game = game;
    }

    runGame() {
        let winner = null;
        do {
            this.game.nextPlayer();
            let move = this.getMove();
            this.game.takeTurn(move);
            winner = this.game.checkWinner();
        } while (!winner);
        //send winner info to each player.
        console.log(`player ${this.game.whoseMove} wins!`);
    }

    getMove() {
        let move = null;
        do {
            //how does the user get feedback on invalid turn?
            move = this.inputHandler.requestMove(this.game.whoseMove);
        } while (!this.game.isValidTurn(move));
        return move;
    }
}