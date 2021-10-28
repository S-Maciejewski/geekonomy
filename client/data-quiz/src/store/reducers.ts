import {Action, ActionType, GetQuizAction, PostAnswerAction} from "./actions";
import {GameState} from "../model";

const initialState: GameState = {
    sessionId: '',
    score: 0,
    indicators: [],
    countries: []
}

const handleGetQuiz = (state: GameState, action: GetQuizAction): GameState => {
    return {
        ...action.state
    }
}

const handlePostAnswer = (state: GameState, action: PostAnswerAction): GameState => {
    return {
        ...state,
        score: action.res.score,
        lastAnswer: {
            country: action.res.country,
            correctCountry: action.res.correctCountry,
            correct: action.res.correct
        }
    }
}

export default function reducer(state = initialState, action: Action): GameState {
    switch (action.type) {
        case ActionType.GET_QUIZ:
            state = handleGetQuiz(state, action as GetQuizAction)
            break
        case ActionType.POST_ANSWER:
            state = handlePostAnswer(state, action as PostAnswerAction)
            break
    }

    return state
}
