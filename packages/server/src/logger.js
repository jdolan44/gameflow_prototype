import winston from 'winston';
const { combine, timestamp, colorize, printf } = winston.format;

let level = "silly";

const logger = winston.createLogger({
    level,
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message} ${JSON.stringify(info.meta)}`)
    ),
    transports: [new winston.transports.Console()],
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