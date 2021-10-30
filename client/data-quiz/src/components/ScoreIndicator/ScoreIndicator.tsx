import React from "react";
import {LastAnswer, QuizStatus} from "../../model";
import styles from './ScoreIndicator.module.scss'

export interface ScoreProps {
    score: number
    lastAnswer?: LastAnswer
    quizStatus: QuizStatus
}

const prettyPrint = (lastAnswer: LastAnswer) => {
    return lastAnswer.correct ?
        <span>Your answer was correct!</span> :
        <span>You were incorrect, the country in question was <b>{lastAnswer.correctCountry}</b> - your answer was {lastAnswer.country}</span>
}

export const ScoreIndicator: React.FC<ScoreProps> = ({score, lastAnswer, quizStatus}) => {
    return (
        <div className={styles.container}>
            <div className={styles.score}>
                <span>Score: <b>{score}</b></span>
            </div>
            <div>
                {
                    lastAnswer && quizStatus === QuizStatus.QUIZ_ANSWERED &&
                    <span>{prettyPrint(lastAnswer)}</span>
                }
            </div>
        </div>)
}