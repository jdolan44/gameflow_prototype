import { GameObject } from "./GameObject.js";

export class SimpleGame extends GameObject {
    winner;
    init() { this.winner = false; }
    isValidTurn(move) {
        return move == "i want to win" || move == "pass";
    }
    takeTurn(move) {
        if (move == "i want to win") { this.winner = true; }
    }
    checkWinner() { return this.winner; }
}