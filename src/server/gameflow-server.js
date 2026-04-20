import { SimpleGame } from "../games/SimpleGame.js";
import { TicTacToe } from "../games/TicTacToe.js";
import express from "express";
import cors from "cors";
import path from "path";
import process from "process";
import { createServer } from "http";
import { createGameServer } from "./createGameServer.js";

const app = express();
app.use(cors());
const server = createServer(app);

// registry so we can create new game instances by name
const gameRegistry = {
    simple: SimpleGame,
    ticTacToe: TicTacToe
};

createGameServer({ httpServer: server, gameRegistry });

app.use(express.static(path.join(process.cwd(), "src/clients")));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'src/clients/web-client.html'));
// });

// app.get('/web-client.js', (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'src/clients/web-client.js'));
// });

//TODO: must be hosted somewhere. turn into a package?
app.get('/gameflow_client.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/core/gameflow-client.js'));
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
