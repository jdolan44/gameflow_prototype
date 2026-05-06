# Gameflow Core Server
This package contains files for the core server of GameFlow.

# Configuration Guide
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