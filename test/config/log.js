
var path = require('path');
var winston = require('../node_modules/winston');

let alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: false
    }),
    winston.format.label({
        label: ''
    }),
    winston.format.timestamp({
        format: "YY-MM-DD HH:mm:ss"
    }),
    winston.format.printf(
        info => `REA ${info.timestamp}  ${info.level} : ${info.message}`
    )
);
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var options = {
    file: {
        level: 'silly',
        filename: `RulesEngineAPI.log`,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
    },
    console: {
        level: 'silly',
        format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
    }
};

const logger = winston.createLogger({

    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
});


require('winston-timer')(logger, {
    "use_colors": false
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;

