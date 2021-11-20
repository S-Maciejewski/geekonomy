import {Action, ActionType, GetQuizAction, PostAnswerAction, RequestSentAction} from "./actions";
import {GameState, QuizStatus} from "../model";

const initialState: GameState = {
    sessionId: '',
    score: 0,
    indicators: [],
    countries: [],
    quizStatus: QuizStatus.NO_QUIZ,
}

const handleGetQuiz = (state: GameState, action: GetQuizAction): GameState => {
    return {
        ...state,
        ...action.state
    }
}

const handlePostAnswer = (state: GameState, action: PostAnswerAction): GameState => {
    return {
        ...state,
        score: action.res.score,
        indicators: action.res.indicators,
        quizStatus: action.res.quizStatus,
        lastAnswer: {
            country: action.res.country,
            correctCountry: action.res.correctCountry,
            correct: action.res.correct
        }
    }
}

const handleRequestSent = (state: GameState): GameState => {
    return {
        ...state,
        quizStatus: QuizStatus.REQUEST_SENT
    }
}

export default function reducer(state = initialState, action: Action): GameState {
    // console.log('Reducer input: ', state, action)

    switch (action.type) {
        case ActionType.GET_QUIZ:
            state = handleGetQuiz(state, action as GetQuizAction)
            break
        case ActionType.POST_ANSWER:
            state = handlePostAnswer(state, action as PostAnswerAction)
            break
        case ActionType.REQUEST_SENT:
            state = handleRequestSent(state)
            break
    }

    return state
}
