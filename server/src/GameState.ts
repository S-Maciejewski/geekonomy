import {QuizServerResponse, QuizData} from "./model";

export enum QuizStatus {
    NO_QUIZ = 'NO_QUIZ',
    FRESH_QUIZ = 'FRESH_QUIZ',
    QUIZ_ANSWERED = 'QUIZ_ANSWERED',
}

export class GameState {
    score: number
    quizData: QuizData | undefined
    quizStatus: QuizStatus


    constructor() {
        this.score = 0
        this.quizData = undefined
        this.quizStatus = QuizStatus.NO_QUIZ
    }

    updateQuizData(quizData: QuizData) {
        this.quizData = quizData;
        this.quizStatus = QuizStatus.FRESH_QUIZ
    }

    getStateForClient(sessionId: string) {
        return ({
            sessionId,
            score: this.score,
            indicators: this.quizData?.indicators,
            countries: this.quizData?.countries,
            quizStatus: this.quizStatus
        }) as QuizServerResponse
    }

    clearScore() {
        this.score = 0
        this.quizStatus = QuizStatus.QUIZ_ANSWERED
    }

    incrementScore() {
        this.score += 1
        this.quizStatus = QuizStatus.QUIZ_ANSWERED
    }
}