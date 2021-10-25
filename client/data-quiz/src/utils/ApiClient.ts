import axios from "axios"
import {AnswerClientResponse, GameState, QuizClientResponse} from "../model";

export class ApiClient {
    static API_URL = 'http://127.0.0.1:8080'
    static sessionIdKey = 'sessionId'

    // static async handleSession(): Promise<void> {
    //     let sessionId = localStorage.getItem(ApiClient.sessionIdKey)
    //     if (!sessionId) {
    //         console.log('No sessionId found, getting new session')
    //         // TODO: get new session from server
    //         sessionId = 'sessionIdFromServer'
    //         localStorage.setItem('sessionId', ApiClient.sessionIdKey)
    //         console.log('Got new sessionId, stored in localStorage:', localStorage.getItem(ApiClient.sessionIdKey))
    //     }
    //     console.log('Session id:', sessionId)
    // }

    static async getQuizGameState(): Promise<GameState> {
        let sessionId = localStorage.getItem(ApiClient.sessionIdKey)
        console.log(`sessionId in localStorage: ${sessionId}`)

        const res = await axios.get<QuizClientResponse>(ApiClient.getUrl('quiz'), {
            params: {sessionId: 'test'}
        })

        const state = ({
            ...res.data
        })

        console.log('state:', state)

        if (!sessionId) {
            console.log('No sessionId found, getting new session')
            // TODO clean this up
            console.log(res.data)
            sessionId = res.data.sessionId
            localStorage.setItem(state.sessionId, ApiClient.sessionIdKey)
            console.log('Got new sessionId, stored in localStorage:', localStorage.getItem(ApiClient.sessionIdKey))
        }

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
}