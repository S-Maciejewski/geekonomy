import React from "react";
import {LastAnswer} from "../../model";

export interface ScoreProps {
    score: number
    lastAnswer?: LastAnswer
}

const prettyPrint = (lastAnswer: LastAnswer) => {
    return lastAnswer.correct ?
        `Your answer was correct!` :
        `You were incorrect, the country in question was ${lastAnswer.correctCountry} - your answer was ${lastAnswer.country}`
}

export const ScoreIndicator: React.FC<ScoreProps> = (props: ScoreProps) => {
    return <>
        {props.lastAnswer && <div>
            <span>{prettyPrint(props.lastAnswer)}</span>
        </div>}
        Score: {props.score}
    </>
}