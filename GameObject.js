import { InputHandler } from "./InputHandler.js";
export class GameObject {

    gameState; //object representing the game state.
    whoseMove; //integer representing which player's turn it is.
    inputHandler; //manages how game input is received.

    constructor(inputHandler = new InputHandler()) {
        if (this.constructor == GameObject) {
            throw new Error("GameObject is abstract and cannot be instantiated directly!");
        }
        if (this.init == undefined) {
            throw new Error("init() must be defined!");
        }
        if (this.takeTurn == undefined) {
            throw new Error("takeTurn() must be defined!");
        }
        if (this.isValidTurn == undefined) {
            throw new Error("isValidTurn() must be defined!");
        }
        if (this.checkWinner == undefined) {
            throw new Error("checkWinner() must be defined!");
        }
        this.inputHandler = inputHandler;
    }

    nextPlayer() {
        if (this.whoseMove == 1) this.whoseMove = 2;
        else this.whoseMove = 1;
    }

    runGame() {
        let winner = null;
        do {
            this.nextPlayer();
            let move = null;
            do {
                //how does the user get feedback on invalid turn?
                move = this.inputHandler.requestMove(this.whoseMove);
            } while (!this.isValidTurn(move));
            this.takeTurn(move);
            winner = this.checkWinner();
        } while (!winner);
        //send winner info to each player.
        console.log(`player ${this.whoseMove} wins!`);
    }


}