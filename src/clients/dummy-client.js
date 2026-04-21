//outline of the client contract. not for actual game use.

import { Client } from "../core/gameflow-client.js";

//initialize the client
const client = new Client("http://localhost:0000");

//client joins a game
client.joinGame("dummy");

//optional: handles joining
client.onJoin();