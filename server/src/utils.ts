import * as fs from "fs";
import {Logger} from "./Logger";

export const serializeToFile = (filePath: string, data: any): void => {
    try {
        fs.unlinkSync(filePath)
    } catch (err) {
        Logger.warn(`Could not delete file ${filePath} before writing to it`, err)
    }
    // Potential for losing sessions here if the server crashes while writing to the file
    // The risk is acceptable for now
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
        if (err) {
            Logger.error(`Could not serialize to file ${filePath}`, err);
        }
    })
}

export const deserializeFromFile = (filePath: string): any => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
        Logger.error(`Could not deserialize from file ${filePath}`, e);
        return {}
    }
}
