import axios from "axios"
import {AnswerServerResponse, QuizServerResponse} from "../model";
import {store} from "../store/store";
import {ActionType, GetQuizAction} from "../store/actions";

export class ApiClient {
    static API_URL = process.env.API_URL || localStorage.getItem('API_URL') || 'http://127.0.0.1:8080'
    static sessionIdKey = 'sessionId'

    static async getQuizGameState(): Promise<void> {
        // TODO: Decide whether to store sessionId in localStorage manually or use persisted redux
        let sessionId = localStorage.getItem(ApiClient.sessionIdKey)
        const res = await axios.get<QuizServerResponse>(ApiClient.getUrl('quiz'), {
            params: {sessionId}
        }).catch((err) => {
            console.error('Axios error', err)
            return {data: {} as QuizServerResponse}
        })

        const state = ({...res.data})
        ApiClient.refreshStoredSession(sessionId, state.sessionId)
        state.indicators.forEach(indicatorData => {
            // @ts-ignore
            indicatorData.series = indicatorData.series.map(entry => [parseFloat(entry[0]), parseFloat(entry[1])])
        })

        store.dispatch(({
            type: ActionType.GET_QUIZ,
            state
        }) as GetQuizAction)
    }

    static async postQuizAnswer(answer: string): Promise<void> {
        let sessionId = localStorage.getItem(ApiClient.sessionIdKey)
        const res = await axios.post<{ answer: string }, { data: AnswerServerResponse }>(ApiClient.getUrl('answer'), {
            answer
        }, {
            params: {sessionId}
        }).catch((err) => {
            console.error('Axios error', err)
            return {data: {} as AnswerServerResponse}
        })

        store.dispatch(({
            type: ActionType.POST_ANSWER,
            res: res.data
        }))
    }

    static setApiUrl(url: string) {
        console.log(`Setting API_URL to: ${url}`)
        localStorage.setItem('API_URL', url)
        ApiClient.API_URL = url
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