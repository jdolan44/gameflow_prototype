import { Client } from "http://localhost:3000/gameflow_client.js";

/** @type {Client} */
const client = new Client("http://localhost:3000");

const joinButton = document.getElementById("join");
const joinStatus = document.getElementById("join_status");
const submitButton = document.getElementById("submit");
const gameStatus = document.getElementById("game_status");
const quitButton = document.getElementById("quit");

//request to join game when the join button is clicked
joinButton.addEventListener("click", () => {
    client.joinGame("simple");
    joinButton.setAttribute("disabled", "true");
    changeGameStatus("");
});

quitButton.addEventListener("click", () => {
    client.quitGame();
});

//sends move when submit button is clicked.
submitButton.addEventListener("click", () => {
    let move = document.getElementById("turn_input").value;
    client.takeTurn(move);
    changeGameStatus("waiting for other player...");
    submitButton.setAttribute("disabled", "true");
    document.getElementById("turn_input").value = "";
});

function changeGameStatus(message) {
    gameStatus.innerHTML = message;
}

//Client handlers:

//notify client of join status
client.onJoin(({ status }) => {
    if (status == "queued") {
        joinStatus.innerHTML = "in queue...";
    }
    if (status == "begin") {
        joinStatus.innerHTML = "joined!";
    }
});

//enables submit button when it is the user's turn.
client.onMyTurn(() => {
    changeGameStatus("it's your turn.");
    submitButton.removeAttribute("disabled");
});

client.onInvalidTurn((message) => {
    window.alert(message);
});

//deal with each game over scenario.
client.onGameOver((outcome) => {
    switch (outcome.reason) {
        case "winner": handleWinner(outcome); break;
        case "quit": handleQuit(outcome.quitter); break;
        case "draw": handleDraw(); break;
    }
    joinButton.removeAttribute("disabled");
    submitButton.setAttribute("disabled", "true");
});

//handlers for each game end type

function handleWinner(data) {
    if (client.isWinner(data)) {
        changeGameStatus("You win!");
    }
    else {
        changeGameStatus("You lose!")
    }
};

function handleQuit(data) {
    changeGameStatus("game quit by: " + data.quitter);
};

function handleDraw() {
    changeGameStatus("it's a draw!");
}
