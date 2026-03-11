//DEPRECATED!!!!
import { InputHandler } from "./InputHandler.js";
import promptSync from 'prompt-sync';
const prompt = promptSync();
export class ConsoleInputHandler extends InputHandler {
    requestMove(playerNumber, status) {
        console.log(`it's player ${playerNumber}'s turn.`);
        let move = prompt("what is your move? ");
        return move;
    }
}