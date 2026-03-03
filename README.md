# GameFlow Prototype
This is a prototype for GameFlow, a framework for the development of two-player turn-based games.

The goal of this prototype is to define a simple contract that multiple two-player games must follow. Additionally, it will help identify common issues that arise when developing two-player turn-based games for the web. 

### Known Issues
- Input handler class is shaky. Originally it only requests moves, but there should be a way to tell each client when the game is over.
- SocketInputHandler's requestMove() isn't very clean.
- No notification system for a player's invalid moves.
