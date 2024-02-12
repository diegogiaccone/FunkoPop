import config from '../config/config.env.js';
import winston from 'winston';

const customLevelOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: `grey`,
        fatal: 'red'
    }
}


const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,    
    transports: [
        new winston.transports.Console({            
            level: `debug`,
            level: `http`,
            level: `info`,
            level: `warning`,
            level: `error`,
            level: `fatal`,
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),     
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({            
            level: 'info',
            level: 'error',
            level: 'fatal',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({level: 'info', level: 'error', level: 'fatal', filename: './src/public/logs/errors.log', format: winston.format.combine(
            winston.format.colorize({colors: customLevelOptions.colors}),            
        )}),
    ]
})

export const addLogger = (req, res, next) => {    
    req.logger = config.MODE === 'DEVELOPMENT' ? devLogger : prodLogger
    req.logger.info(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`)    
    next();
}