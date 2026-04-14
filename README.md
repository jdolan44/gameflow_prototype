# GameFlow Prototype
This is a prototype for GameFlow, a framework for the development of two-player turn-based games.

The goal of this prototype is to define a simple contract that multiple two-player games must follow. Additionally, it will help identify common issues that arise when developing two-player turn-based games for the web. 

### Known Issues
- no official protocol event for draws.
- the current demo page and the core server are deployed together. Ideally, they should be able to deploy as individual units.
- No testing suite.
- the core server is coupled directly to Socket.IO. I may change this to a "transport layer" object that deals with everything Socket.IO.

### Timeline
- April:
    - begin design/implementation of the final system.
    - integrate GameFlow as smoothly as possible with web clients.
    - begin development of the demo application.
- May:
    - finalize demo application.
    - Host final application.
    - write system documentation, user guide, etc.
