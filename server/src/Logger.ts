// @ts-ignore
import pino from 'pino';

export class Logger {
    static logsPath = process.env.LOGS_PATH || './logs'
    static logFilePath = `${Logger.logsPath}/server_${Date.now()}.log`
    static logger = pino({}, pino.destination(Logger.logFilePath))

    static info = (msg: string, ...args: any[]) => {
        Logger.logger.info({msg, args})
        console.log(msg, ...args)
    }

    static error = (msg: string, ...args: any[]) => {
        Logger.logger.error({msg, args})
        console.log(msg, ...args)
    }

    static warn = (msg: string, ...args: any[]) => {
        Logger.logger.warn({msg, args})
        console.log(msg, ...args)
    }
}
