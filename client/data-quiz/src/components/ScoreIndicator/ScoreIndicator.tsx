import React from "react";
import {LastAnswer, QuizStatus} from "../../model";

export interface ScoreProps {
    score: number
    lastAnswer?: LastAnswer
    quizStatus: QuizStatus
}

const prettyPrint = (lastAnswer: LastAnswer) => {
    return lastAnswer.correct ?
        `Your answer was correct!` :
        `You were incorrect, the country in question was ${lastAnswer.correctCountry} - your answer was ${lastAnswer.country}`
}

export const ScoreIndicator: React.FC<ScoreProps> = ({score, lastAnswer, quizStatus}) => {
    return <>
        {lastAnswer && quizStatus === QuizStatus.QUIZ_ANSWERED && <div>
            <span>{prettyPrint(lastAnswer)}</span>
        </div>}
        Score: {score}
    </>
}