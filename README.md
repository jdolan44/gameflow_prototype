# GameFlow
GameFlow is a Javascript framework for the development of two-player, turn based web games. The framework consists of two main packages: `gameflow` and `gameflow-client`. The first provides a simple mechanism for running and developing a two-player game server. The second provides a suite of event-based methods to integrate games with a web client. This repository also contains multiple demo applications to showcase the functionality of GameFlow.

## Why GameFlow?
GameFlow seeks to make creating a game server as easy as possible. GameFlow features:
- Server-authoritative architecture
- Client-server networking
- Automatic verification of player turns
- A simple interface for joining, playing, and quitting games
- Event-driven and asynchronous game updates
- Framework-agnostic client integration

## Setup
Setting up GameFlow involves:
- Importing the `gameflow` and `gameflow-client` packages.
- Creating a `GameObject`.
- Creating the game server.
- Developing the client UI for your game.

More details on setup can be found in [setup.md](./setup.md).

## Known Issues
- shutting down the server may have strange effects on the client.
- the core server is coupled directly to Socket.IO. I may change this to a "transport layer" object that deals with everything Socket.IO.
- The server does not properly handle requests to join a game that is not registered in the game registry.
- The server only checks for game overs after each player has placed their turn. This limits games which could end in some other way (ex. a timed game where the player runs out of time).
