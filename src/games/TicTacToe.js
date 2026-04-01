import { GameObject } from "../core/GameObject.js";

export class TicTacToe extends GameObject {
    // move all state into gameState so it can be inspected/serialized
    initialState() {
        return {
            board: [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ],
            marks: ['X', 'O'],
            winner: null,        // will hold winning mark or 'draw'
        };
    }
    isValidTurn({ x, y }, { board }) { //moves should have properties x and y
        return x >= 0 && x <= 2 &&
            y >= 0 && y <= 2 &&
            board[x][y] == null;
    }

    takeTurn({ x, y }, { marks, board }) {
        const mark = marks[this.whoseMove - 1];
        board[x][y] = mark;
    }

    checkWinner(gameState) {
        const b = gameState.board;
        const checkLine = (a, b, c) => a && a === b && a === c;

        // rows/columns
        for (let i = 0; i < 3; i++) {
            if (checkLine(b[i][0], b[i][1], b[i][2])) {
                gameState.winner = b[i][0];
                return true;
            }
            if (checkLine(b[0][i], b[1][i], b[2][i])) {
                gameState.winner = b[0][i];
                return true;
            }
        }

        // diagonals
        if (checkLine(b[0][0], b[1][1], b[2][2])) {
            gameState.winner = b[0][0];
            return true;
        }
        if (checkLine(b[0][2], b[1][1], b[2][0])) {
            gameState.winner = b[0][2];
            return true;
        }

        // draw
        const full = b.every(row => row.every(cell => cell !== null));
        if (full) {
            gameState.winner = 'draw';
            return true;
        }

        return false;
    }
}