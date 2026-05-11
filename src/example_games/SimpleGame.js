import { GameObject } from "gameflow";

export class SimpleGame extends GameObject {
    initialState() { return { lastMove: "" } }
    /**@override */
    isValidTurn(move, gameState) {
        return move == "i want to win" || move == "pass" || move == "draw please";
    }
    takeTurn(move, gameState) {
        gameState.lastMove = move;
    }
    checkGameOver(gameState) {
        switch (gameState.lastMove) {
            case "i want to win": return { type: 'winner', winner: this.whoseMove };
            case "draw please": return { type: 'draw' };
            default: return null;
        }
    }
}