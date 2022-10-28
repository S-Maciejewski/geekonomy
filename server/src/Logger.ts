import pino from 'pino';

const logFilePath = `./logs/server_${Date.now()}.log`;
const logger = pino({}, pino.destination(logFilePath));

export namespace Logger {
    export const info = (msg: string, ...args: any[]) => {
        logger.info({msg, args})
        console.log(msg, ...args)
    }

    export const error = (msg: string, ...args: any[]) => {
        logger.error({msg, args})
        console.log(msg, ...args)
    }

    export const warn = (msg: string, ...args: any[]) => {
        logger.warn({msg, args})
        console.log(msg, ...args)
    }
}
