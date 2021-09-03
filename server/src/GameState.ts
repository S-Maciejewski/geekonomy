import {QuizData} from "./model";

export class GameState {
    score: number
    quizData: QuizData | undefined

    constructor() {
        this.score = 0
        this.quizData = undefined
    }

    updateQuizData () {

    }
}