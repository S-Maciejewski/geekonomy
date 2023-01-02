import axios from "axios"
import {AnswerServerResponse, IndicatorData, QuizServerResponse} from "../model";
import {store} from "../store/store";
import {ActionType, GetQuizAction} from "../store/actions";
import {Highscore} from "../components/types";

export class ApiClient {
    static API_URL = process.env.REACT_APP_API_URL || localStorage.getItem('API_URL') || 'http://127.0.0.1:80'
    static sessionIdKey = 'sessionId'

    static async getQuizGameState(): Promise<void> {
        let sessionId = localStorage.getItem(ApiClient.sessionIdKey)
        store.dispatch({
            type: ActionType.REQUEST_SENT
        })

        const res = await axios.get<QuizServerResponse>(ApiClient.getUrl('quiz'), {
            params: {sessionId}
        }).catch((err) => {
            console.error('Axios error', err)
            return {data: {} as QuizServerResponse}
        })

        const state = ({...res.data})
        ApiClient.refreshStoredSession(sessionId, state.sessionId)
        ApiClient.normalizeIndicators(state.indicators)

        store.dispatch(({
            type: ActionType.GET_QUIZ,
            state
        }) as GetQuizAction)
    }

    static async postQuizAnswer(answer: string): Promise<void> {
        let sessionId = localStorage.getItem(ApiClient.sessionIdKey)
        store.dispatch({
            type: ActionType.REQUEST_SENT
        })

        const res = await axios.post<{ answer: string }, { data: AnswerServerResponse }>(ApiClient.getUrl('answer'), {
            answer
        }, {
            params: {sessionId}
        }).catch((err) => {
            console.error('Axios error', err)
            return {data: {} as AnswerServerResponse}
        })

        ApiClient.normalizeIndicators(res.data.indicators)

        store.dispatch(({
            type: ActionType.POST_ANSWER,
            res: res.data
        }))
    }

    static async getHighscores(): Promise<Highscore[]> {
        const res = await axios.get<Highscore[]>(ApiClient.getUrl('highscore')).catch((err) => {
            console.error('Axios error', err)
            return {data: [] as Highscore[]}
        })
        return res.data
    }


    static setApiUrl(url: string) {
        console.log(`Setting API_URL to: ${url}`)
        localStorage.setItem('API_URL', url)
        ApiClient.API_URL = url
    }

    static getUrl(path: string) {
        return `${ApiClient.API_URL}/${path}`
    }

    private static formatIndicatorValue(value: string) {
        return parseFloat(value) > 1_000 ? parseFloat(parseFloat(value).toFixed(0)) : parseFloat(parseFloat(value).toFixed(4))
    }

    private static normalizeIndicators(indicators: IndicatorData[]) {
        indicators.forEach(indicatorData => {
            // @ts-ignore
            indicatorData.series = indicatorData.series.map(entry => [parseFloat(entry[0]), ApiClient.formatIndicatorValue(entry[1])])
        })
    }

    private static refreshStoredSession(sessionId: string | null, stateSessionId: string) {
        if (!sessionId || sessionId !== stateSessionId) {
            console.log(`No matching session found on server - received a fresh session: ${stateSessionId}`)
            localStorage.setItem(ApiClient.sessionIdKey, stateSessionId)
        }
    }
}
