# Gameflow Core Server
This package contains files for the core server of GameFlow.

# Configuration Guide

## Server Options
The following is a list of options for the GameFlow server, which can be passed into `createGameServer()`.
- `httpServer`: an existing http server object. This option should be used if you want your GameFlow server to be deployed in conjunction with an existing server (such as express). When using this option, the server will start whenever the `httpServer` object is started.
- `port`: the port on which the server should run.
- `gameRegsitry`: A dictionary containing all games to be run on the server. Keys represent the string identifier which clients reference to join.
- `cors`: CORS options for the server. Follows the same structure as Express' `cors` middleware.

## Logging
The GameFlow server features a logging system for server events. these logs can be output to the console or a file. See [config/logger.json](config/logger.json) for all configuration settings.

### Log Config quick guide:
- `disableAll`: a flag to quickly disable all logging.
- `eabled`: enables logging for a specific log type (ex. to enable console logging, "console" -> "enabled" should be set to true. )
- `level`: sets the logging level for a specific log type. See "Supported Logging Levels" below.
- `filename`: sets the filename for logs output to a file.
- `maxsize`: sets the size limit for log files.

### Supported Log Levels
`winston` is the primary package used for logging. GameFlow's log system uses the same default levels as that package. For detailed info on logging levels from the creators of `winston`, [click here](https://github.com/winstonjs/winston#logging-levels).