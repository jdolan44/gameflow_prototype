import winston from 'winston';
import config from "../config/logger.json" with {type: "json"}
const { combine, timestamp, colorize, printf, json } = winston.format;

let transports = []


//custom timestamp
let defaultTimestamp = timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A',
});

//custom formats
let consoleDefaultFormat = combine(
    colorize({ all: true }),
    defaultTimestamp,
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message} ${JSON.stringify(info.meta)}`)
)

//enable console if needed
if (config.console.enabled) {
    transports.push(new winston.transports.Console({
        level: config.console.level,
        format: consoleDefaultFormat
    }));
}
//enable file logging
if (config.file.enabled) {
    transports.push(new winston.transports.File({
        level: config.file.level,
        filename: config.file.filename,
        format: combine(defaultTimestamp, json())
    }));
}

const logger = winston.createLogger({
    silent: config.disableAll,
    transports
});

/**
 * Creates a log entry of the given parameters.
 * @param {string} level 
 * @param {string} message 
 * @param {Object} meta 
 */
export function log(level, message, meta) {
    logger.log(level, message, { meta })
}