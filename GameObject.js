import { InputHandler } from "./InputHandler.js";
export class GameObject {

    gameState; //object representing the game state.
    whoseMove; //integer representing which player's turn it is.

    constructor() {
        if (this.constructor == GameObject) {
            throw new Error("GameObject is abstract and cannot be instantiated directly!");
        }
        if (this.initialState == undefined) {
            throw new Error("initialState() must be defined!");
        }
        if (this.takeTurn == undefined) {
            throw new Error("takeTurn(move, gameState) must be defined!");
        }
        if (this.isValidTurn == undefined) {
            throw new Error("isValidTurn(move, gameState) must be defined!");
        }
        if (this.checkWinner == undefined) {
            throw new Error("checkWinner(gameState) must be defined!");
        }
        this.gameState = this.initialState();
    }

    nextPlayer() {
        if (this.whoseMove == 1) this.whoseMove = 2;
        else this.whoseMove = 1;
    }

}