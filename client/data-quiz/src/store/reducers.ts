import {Action, ActionType, GetQuizAction, PostAnswerAction} from "./actions";
import {ControlsState, GameState, QuizStatus} from "../model";

const initialState: GameState = {
    sessionId: '',
    score: 0,
    indicators: [],
    countries: [],
    quizStatus: QuizStatus.NO_QUIZ,
    controlsState: ControlsState.DECISION_ENABLED,
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
        quizStatus: action.res.quizStatus,
        lastAnswer: {
            country: action.res.country,
            correctCountry: action.res.correctCountry,
            correct: action.res.correct
        }
    }
}

export default function reducer(state = initialState, action: Action): GameState {
    console.log('reducer input: ', state, action)

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
