import { GameObject } from "gameflow";

export class TicTacToe extends GameObject {
    //initial state of the game
    initialState() {
        return {
            board: [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ],
            marks: ['X', 'O']
        };
    }

    //validates a player's turn (must be placed on an empty square).
    isValidTurn({ x, y }, { board }) {
        return x >= 0 && x <= 2 &&
            y >= 0 && y <= 2 &&
            board[x][y] == null;
    }

    //applies the user's turn (pre-verified by the server).
    takeTurn({ x, y }, { marks, board }) {
        const mark = marks[this.whoseMove - 1];
        board[x][y] = mark;
    }

    //checks for an end to the game.
    checkGameOver(gameState) {
        const b = gameState.board;
        const checkLine = (a, b, c) => a && a === b && a === c;
        let winner = false;

        // check rows/columns
        for (let i = 0; i < 3; i++) {
            if (checkLine(b[i][0], b[i][1], b[i][2])) {
                winner = true;
            }
            if (checkLine(b[0][i], b[1][i], b[2][i])) {
                winner = true;
            }
        }

        // check diagonals
        if (checkLine(b[0][0], b[1][1], b[2][2])) {
            winner = true;
        }
        if (checkLine(b[0][2], b[1][1], b[2][0])) {
            winner = true;
        }

        if (winner) {
            return { type: 'winner', winner: this.whoseMove };
        }

        // draw
        const full = b.every(row => row.every(cell => cell !== null));
        if (full) {
            return { type: 'draw' };
        }
        //game continues
        return null;
    }
}