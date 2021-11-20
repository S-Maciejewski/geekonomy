import {AnswerServerResponse, GameState} from "../model";

export enum ActionType {
    GET_QUIZ = 'GET_QUIZ',
    POST_ANSWER = 'POST_ANSWER',
    REQUEST_SENT = 'REQUEST_SENT',
}

export interface Action {
    type: ActionType
}

export interface GetQuizAction extends Action {
    type: ActionType.GET_QUIZ
    state: GameState
}

export interface PostAnswerAction extends Action {
    type: ActionType.POST_ANSWER
    res: AnswerServerResponse
}

export interface RequestSentAction extends Action {
    type: ActionType.REQUEST_SENT
}