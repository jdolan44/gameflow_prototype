import { GameObject } from "./GameObject.js";

export class TicTacToe extends GameObject {
    // move all state into gameState so it can be inspected/serialized
    init() {
        this.gameState = {
            board: [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ],
            playerMarks: ['X', 'O'],
            winner: null,        // will hold winning mark or 'draw'
        };
    }
    isValidTurn(move) { //moves should have properties x and y
        const b = this.gameState.board;
        return move &&
            move.x >= 0 && move.x <= 2 &&
            move.y >= 0 && move.y <= 2 &&
            b[move.x][move.y] == null;
    }

    takeTurn(move) {
        const mark = this.gameState.playerMarks[this.whoseMove - 1];
        this.gameState.board[move.x][move.y] = mark;
    }

    checkWinner() {
        const b = this.gameState.board;
        const checkLine = (a, b, c) => a && a === b && a === c;

        // rows/columns
        for (let i = 0; i < 3; i++) {
            if (checkLine(b[i][0], b[i][1], b[i][2])) {
                this.gameState.winner = b[i][0];
                return true;
            }
            if (checkLine(b[0][i], b[1][i], b[2][i])) {
                this.gameState.winner = b[0][i];
                return true;
            }
        }

        // diagonals
        if (checkLine(b[0][0], b[1][1], b[2][2])) {
            this.gameState.winner = b[0][0];
            return true;
        }
        if (checkLine(b[0][2], b[1][1], b[2][0])) {
            this.gameState.winner = b[0][2];
            return true;
        }

        // draw
        const full = b.every(row => row.every(cell => cell !== null));
        if (full) {
            this.gameState.winner = 'draw';
            return true;
        }

        return false;
    }
}