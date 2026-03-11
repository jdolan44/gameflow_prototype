export class InputHandler {
    constructor() {
        if (this.constructor == InputHandler) {
            throw new Error("InputHandler is abstract and cannot be instantiated directly!");
        }
        if (this.requestMove == undefined) {
            // requestMove(playerID, gameState) must be implemented by subclasses
            throw new Error("requestMove() must be defined!");
        }
        if (this.emitGameOver == undefined) {
            // emitGameOver(playerID, gameState)
            throw new Error("emitGameOver() must be defined!");
        }
    }
}