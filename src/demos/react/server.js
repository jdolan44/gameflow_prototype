import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { createGameServer } from "gameflow";
import { TicTacToe } from "../../games/TicTacToe.js";
import { SimpleGame } from "../../games/SimpleGame.js";

async function start() {
    const app = express();

    const vite = await createViteServer({
        server: { middlewareMode: true }
    });

    app.use(vite.middlewares);

    const gameRegistry = {
        ticTacToe: TicTacToe,
        simple: SimpleGame
    };
    const mycors = { origin: "*" };

    const httpServer = createHttpServer(app);
    createGameServer({ httpServer, gameRegistry, cors: mycors });

    httpServer.listen(3000);
    console.log("server running at http://localhost:3000");
}

start();