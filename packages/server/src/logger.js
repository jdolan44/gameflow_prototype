import winston from 'winston';

/**
 * Creates a logging object using winstonjs.
 * @param {string} level
 */
const createLogger = (level) => winston.createLogger({
    level,
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

export default createLogger;