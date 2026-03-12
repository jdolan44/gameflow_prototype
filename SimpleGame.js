import { GameObject } from "./GameObject.js";

export class SimpleGame extends GameObject {
    initialState() { return { winner: false } }
    isValidTurn(move, gameState) {
        return move == "i want to win" || move == "pass";
    }
    takeTurn(move, gameState) {
        if (move == "i want to win") { gameState.winner = true; }
    }
    checkWinner(gameState) { return gameState.winner; }
}