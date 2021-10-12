import axios from "axios"
import {AnswerClientResponse, GameState, QuizClientResponse} from "../model";
import Cookies from 'universal-cookie'

export class ApiClient {
    static API_URL = 'http://127.0.0.1:8080'
    static cookie = new Cookies()

    static async getQuizGameState(): Promise<GameState> {
        const res = await axios.get<QuizClientResponse>(ApiClient.getUrl('quiz'), {
            withCredentials: true
            // headers: {
            //     "Cookie": this.cookie.get('sessionId') ? `sessionId=${this.cookie.get('sessionId')};` : ''
            // }
        })
        // this.cookie.set('sessionId', res.config)
        const state = ({
            ...res.data
        })
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