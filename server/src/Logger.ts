import pino from 'pino';

// TODO: add multistream support (file, stdout)

// TODO: fix problems with pino not being able to create files
// const logger = pino({}, pino.destination(`./logs/server_${new Date().toISOString().slice(0, 19).replace('T', '-')}.log`));

export namespace Logger {
    export const info = (msg: string, ...args: any[]) => {
        // logger.info({msg, args})
        console.log(msg, ...args)
    }

    export const error = (msg: string, ...args: any[]) => {
        // logger.error({msg, args})
        console.log(msg, ...args)
    }

    export const warn = (msg: string, ...args: any[]) => {
        // logger.warn({msg, args})
        console.log(msg, ...args)
    }
}
