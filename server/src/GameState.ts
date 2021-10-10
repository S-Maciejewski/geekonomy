import {QuizClientResponse, QuizData} from "./model";

export class GameState {
    score: number
    quizData: QuizData | undefined

    constructor() {
        this.score = 0
        this.quizData = undefined
    }

    updateQuizData(quizData: QuizData) {
        this.quizData = quizData;
    }

    getStateForClient() {
        return ({
            score: this.score,
            indicators: this.quizData?.indicators,
            countries: this.quizData?.countries
        }) as QuizClientResponse
    }
}