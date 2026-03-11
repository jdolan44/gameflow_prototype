import { InputHandler } from "./InputHandler.js";

export class SocketInputHandler extends InputHandler {
    socket;

    constructor(socket) {
        super();
        this.socket = socket;
    }


    async requestMove(status, gameState) {
        return new Promise((resolve) => {
            // send current state along so client can render it
            this.socket.emit('request_move', status, gameState, (response) => {
                resolve(response.move);
            });
        });
    }

    emitGameOver(status, gameState) {
        this.socket.emit("game_over", status, gameState);
    }
}