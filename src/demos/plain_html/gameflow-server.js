import { SimpleGame } from "../../games/SimpleGame.js";
import { TicTacToe } from "../../games/TicTacToe.js";
import express from "express";
import cors from "cors";
import path from "path";
import process from "process";
import { createServer } from "http";
import { createGameServer } from "gameflow";
import { Count21 } from "../../games/Count21.js";

const app = express();
app.use(cors());
const server = createServer(app);

// registry so we can create new game instances by name
const gameRegistry = {
    simple: SimpleGame,
    ticTacToe: TicTacToe,
    count21: Count21
};

const mycors = { origin: "*" };

//for hosting on a different port:
//createGameServer({ port: 4000, gameRegistry, cors: { origin: "*" } }).start();
createGameServer({ httpServer: server, gameRegistry, cors: mycors });

app.use(express.static(path.join(process.cwd(), "src/demos/plain_html")));

//TODO: tech debt. shhhhhh
app.get('/gameflow_client.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'packages/client/dist/browser.js'));
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
