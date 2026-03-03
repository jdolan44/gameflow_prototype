import { InputHandler } from "./InputHandler.js";

export class SocketInputHandler extends InputHandler {
    socket;

    constructor(socket) {
        super();
        this.socket = socket;
    }


    async requestMove(status) {
        return new Promise((resolve) => {
            this.socket.emit('request_move', status, (response) => {
                resolve(response.move);
            });
        });
    }

    emitGameOver(status) {
        this.socket.emit("game_over", status);
    }
}