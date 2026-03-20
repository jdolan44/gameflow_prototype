# GameFlow Prototype
This is a prototype for GameFlow, a framework for the development of two-player turn-based games.

The goal of this prototype is to define a simple contract that multiple two-player games must follow. Additionally, it will help identify common issues that arise when developing two-player turn-based games for the web. 

### Known Issues
- No notification system for a player's invalid moves.
- The Socket.IO protocol needs some refining.
    - Initially, I had a "request move" event which uses Socket.IO's callback feature. However I've decided to modify it so the system is solely send/recieve. 
- the `GameObject` class also manages running the state of the game. I plan to move this back into the `Session` object.
- the core server is coupled directly to Socket.IO. I may change this to a "transport layer" object that deals with everything Socket.IO.
- some issues with connecting GameFlow to a web client.
