import axios from "axios"
import {GameState, QuizClientResponse} from "../model";

export class ApiClient {
    static API_URL = 'http://127.0.0.1:8080'

    static async getQuizGameState(): Promise<GameState> {
        const res = await axios.get<QuizClientResponse>(ApiClient.getUrl('quiz'))
        return ({
            ...res.data
        })
    }


    static getUrl(path: string) {
        return `${ApiClient.API_URL}/${path}`
    }
}