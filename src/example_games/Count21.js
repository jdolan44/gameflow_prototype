import { GameObject } from "gameflow";

export class Count21 extends GameObject {
    initialState() {
        return { count: 0 }
    }

    isValidTurn({ count }) {
        return count === 1 || count === 2 || count === 3;
    }

    takeTurn(move, gameState) {
        gameState.count += move.count;
        console.log("current count: " + gameState.count);
    }

    checkGameOver(gameState) {
        if (gameState.count >= 21) return { type: 'winner', winner: (this.whoseMove % 2) + 1 };
        return null;
    }
}