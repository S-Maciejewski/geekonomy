import axios from "axios"
import {AnswerClientResponse, GameState, QuizClientResponse} from "../model";

export class ApiClient {
    static API_URL = 'http://127.0.0.1:8080'
    static sessionIdKey = 'sessionId'

    static async getQuizGameState(): Promise<GameState> {
        let sessionId = localStorage.getItem(ApiClient.sessionIdKey)

        const res = await axios.get<QuizClientResponse>(ApiClient.getUrl('quiz'), {
            params: {sessionId}
        })

        const state = ({...res.data})
        ApiClient.refreshStoredSession(sessionId, state.sessionId)
        state.indicators.forEach(indicatorData => {
            // @ts-ignore
            indicatorData.series = indicatorData.series.map(entry => [parseFloat(entry[0]), parseFloat(entry[1])])
        })
        return state
    }

    static async postQuizAnswer(answer: string): Promise<void> {
        const res = await axios.post(ApiClient.getUrl('answer'), {
            answer
        }, {
            withCredentials: true
        })
    }


    static getUrl(path: string) {
        return `${ApiClient.API_URL}/${path}`
    }

    private static refreshStoredSession(sessionId: string | null, stateSessionId: string) {
        if (!sessionId || sessionId !== stateSessionId) {
            console.log(`No matching session found on server - received a fresh session: ${stateSessionId}`)
            localStorage.setItem(ApiClient.sessionIdKey, stateSessionId)
        }
    }
}