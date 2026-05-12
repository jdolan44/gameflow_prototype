# GameFlow Setup
This guide walks through creating and running your first multiplayer game using GameFlow.

By the end of this tutorial, you will:
- Create your first game object
- start a GameFlow server
- Connect a web client
- create a fully-functioning game.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Creating a Game Object](#step-1-creating-a-game-object)
- [Creating a Game Server](#step-2-creating-a-game-server)

## Prerequisites:
Before starting, be sure to have:
- Basic JavaScript knowledge
- Node.js installed
- npm initialized
- A front-end application (optional, but React recommended)

This tutorial will set up a basic Tic-tac-toe game in React.

## Installation
`gameflow` and `gameflow-client` currently exist as private packages. To use both in your porject:
- copy the [packages](packages) folder from this repository into your project.
- add the following attribute to your `package.json` file:
```json
{
...

"workspaces": [
    "packages/*",
    "src/demos/react"
  ],

...
}
```

This allows both packages to be imported as if they were a public npm package.

## Project Structure
recommended project layout:
```
my-game-site/
├── client/ <-- for front-end client code.
├── server/ <-- hosting the front-end and GameFlow server
├── games/ <-- for Game Objects
│   └── TicTacToe.js
├── package.json 
```

## Step 1: Creating a Game Object
```js
import { GameObject } from "gameflow";

export class TicTacToe extends GameObject {
  
}
```

GameObject is the base class for all GameFlow games. To create your first game, the following methods must be overridden:

### Defining Initial State

```js
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
```
The `initialState()` method determines game state at the very beginning of the game. In the case of TTT, this is an empty board along with the marks for each player.

### Validating turns
```js
isValidTurn(move, gameState) {
    return move.x >= 0 && move.x <= 2 &&
        move.y >= 0 && move.y <= 2 &&
        gameState.board[x][y] == null;
}
```
`isValidTurn()` will always be called when a user places their turn to the server. its parameters are the player's turn (as a JavaScript obejct) and the current state of the game.

In our TTT example, a valid turn is within the 3x3 board and must be placed on an empty square.

### Taking Turns

```js
takeTurn({ x, y }, { marks, board }) {
    //places the mark belonging to the current player.
    //arrays begin at 0, but player IDs begin at 1.
    const mark = marks[this.whoseMove - 1];
    board[x][y] = mark;
}
```
`takeTurn()` takes the same parameters as `isValidTurn()` (note: this example is using object decomposition on the `move` and `gameState` parameters).

For moves in TicTacToe, we need to figure out whose turn it actually is (so we know whether to place an 'X' or an 'O'). To do this, `GameObject` provides a property called `whoseMove`. This property contains a number representing the current player, starting at 1.

the server guarantees that `takeTurn()` will always be called *after* `isValidTurn()`, so there's no need to re-validate a turn in `takeTurn()`.

### Detecting Game Over

Tic-Tac-Toe can end in multiple different ways:
- A winner is declared by getting 3 in a row
- A draw occurs when the board is full.
- A user quites the game.

The GameFlow server automatically handles the event where a user quits the game (see Client Integration section below). For now, let's handle the case of a winner and draw.

```js
checkGameOver(gameState){
    const b = gameState.board;
    let winner = false;
    //helper function for checking a line
    const checkLine = (a, b, c) => a && a === b && a === c;
}
```

The below code checks all possible lines for a tic-tac-toe game.

```js
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
```

Now we have determined if there's a winner. Let's look at how we notify the serve that someone has won the game.
```js
if (winner) {
    return { type: 'winner', winner: this.whoseMove };
}
```
When the game should be ended, an object is returned. This object must have a property called `type` which specifies why the game is ending (in this example, because someone has won).

The `winner` type is handled by the server so that clients can determine if they won or not. as additional data, the `winner` event must include the player number of the winning player (in the case of TicTacToe, the player who last made their move).

Now to handle a draw.

```js
// draw
const full = b.every(row => row.every(cell => cell !== null));
if (full) {
    return { type: 'draw' };
}
```

for TicTacToe, we return a draw if the board is full but there wasn't a winner.

Note: GameFlow can handle custom types of game endings, as long as your client handles them properly. As a general rule of thumb though, you should always implement the `winner` type though.

Finally, if the game should continue, `null` should be returned.

```js
... //all previous code
//game continues
return null;
```

### What you don't need to handle
the GameFlow server handles many thigns for you, so that designing game objects is easier. 
- Validating turns before they are placed
- Synchronizing game state between clients
- enforcing turn order (if it's not your turn, any moves sent will be rejected)
- quitting the game

Now you are ready to create a server which plays TicTacToe!

## Step 2: Creating a Game Server

Creating a GameFlow Server is carried out mainly through one method: `createGameServer()`.For this example, let's run our server separately from our front-end on port 4000.

in `server/gameflow-server.js`:
```js
import { createGameServer } from "gameflow";
import { TicTacToe } from "../games/TicTacToe.js"; //where our GameObject is located

const gameRegistry = {
    ttt: TicTacToe
}

createGameServer({gameRegistry, port: 4000})
    .start();
```
let's unpack each line here:
### Game Registry
The game registry is a dictionary of games you want to run on the GameFlow server. You can include as many games as you'd like. The key value acts as an ID for clients to connect to the game (we'll get to that later in the tutorial).

### Server Options
The GameFlow server can also take a variety of options. In the example above, we set the port number to be 4000. We also pass in our game registry as an option.

later in this tutorial, we'll be running our front-end on a different port (3000). Another option we can pass will prevent CORS issues. Long story short, passing in this `cors` option will enable port 3000 access to the server.

```js
const mycors = { origin: "http://localhost:3000" };
createGameServer({gameRegistry, port: 4000, cors: mycors})
    .start();
```

see [here](../packages/server/README.md#server-options) for more details on server options.

### Starting the server
The server begins running by calling the `start()` function as shown above. You should see console messages that the server has begun running. The GameFlow server also features a built-in logger. see [here](../packages/server/README.md#logging) for more details on the logger.

## Step 3: Connecting a Web Client

In this step, we'll create a basic tic-tac-toe app in React which uses the gameflow client.

### Client Initialization
Create the client somewhere near your app entry point:

```js
import { Client } from "gameflow-client";

//param: location of our server.
const client = new Client("http://localhost:4000");
```
You then pass this client into your game component.

```jsx
<TTT client={client} />
```
The UI itself is not important to GameFlow — the only requirement is that your component can call client methods and react to events.

### Joining a game

To connect a player to a running game session:
```js
client.joinGame("ttt");
```

In context of our TicTacToe example:
```jsx
<button onClick={() => client.joinGame("ttt")}>
    Join Game
</button>
```
The string "ttt" is the game identifier registered on the server.

Once connected, the server begins sending events to the client.

### Listening for Game Events

GameFlow communicates entirely through event handlers.

Your client registers callbacks using methods like:
```js
client.onJoin(...)
client.onMyTurn(...)
client.onStateUpdate(...)
client.onGameOver(...)
```

#### onJoin

Triggered when the player successfully joins the game.

```js
client.onJoin((data) => setStatus(data.status));
```

Example server messages:
```js
{ status: "queued" } //waiting for anopther player
```
or
```js
{ status: "joined" } //both players have joined.
```

#### onMyTurn

Triggered when the server determines the player can act.
```js
client.onMyTurn(() => handleMyTurn(setStatus, setMyTurn));
```
In the TicTacToe example this:
- Updates the UI message
- Enables board interaction

```js
function handleMyTurn(setStatus, setMyTurn) {
    setStatus("it's your turn!");
    setMyTurn(true);
}
```
This is important because GameFlow is authoritative — the client should only allow moves when the server says it is valid.

#### onStateUpdate

Triggered whenever the game state changes.
```js
client.onStateUpdate((gameState) =>
    setBoard(gameState.board)
);
```
The server sends the latest game state, and the client updates the UI from it.

Example state:
```js
{
    board: [
        ["X", null, "O"],
        [null, "X", null],
        ["O", null, null]
    ],
    marks: ["X", "O"]
}
```
A key GameFlow principle is:
- The server owns the game state.
The client only renders it.

The client should avoid locally modifying game data directly.

#### onGameOver

Triggered when the match ends.
```js
client.onGameOver((outcome) =>
    handleGameOver(outcome, setStatus)
);
```
This TicTacToe game handles:

Wins
Draws
Quits

Example payloads:
```js
{
    reason: "winner",
    isWinner: true
}
{
    reason: "draw"
}
{
    reason: "quit",
    quitter: "player2"
}
```
### Sending Player Actions

Players interact with the game by sending actions back to the server.

Your example sends moves using:

client.takeTurn({ x, y });

Full example:
```js
function handleCellClick({ x, y }) {
    if (myTurn) {
        client.takeTurn({ x, y });
        setMyTurn(false);
    }
}
```
The important idea here is:
- The client sends an action request
- The server validates it
- The server broadcasts the updated game state
- Clients re-render from the new state

The client should never directly modify the board itself.

### Quitting the game
GameFlow clients can also leave an active match at any time.

To quit the current game session:
```js
client.quitGame();
```
A common pattern is to attach this to a button:
```jsx
<button onClick={() => client.quitGame()}>
    Quit Game
</button>
```
When a player quits:
1. The client notifies the server
2. The server ends the match
3. both players receive an `onGameOver` event
4. The game outcome includes `"quit"` as the reason, and `"quitter"` as the player who quit the game. 

The `OnGameOver()` handler we already created handles quit events.