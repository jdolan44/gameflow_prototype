import { SimpleGame } from "./SimpleGame.js";
import { Session } from "./Session.js";
let game = new SimpleGame();
let session = new Session(1, 2, game);

session.runGame();