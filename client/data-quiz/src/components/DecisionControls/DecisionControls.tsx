import {Button} from "@mui/material";
import React from "react";
import {Country, QuizStatus} from "../../model";
import styles from './DecisionControls.module.scss'
import {Engine} from "../../services/Engine";

export interface ControlsProps {
    countries: Country[]
    quizStatus: QuizStatus
}

export const DecisionControls: React.FC<ControlsProps> = ({countries, quizStatus}) => {

    return (<div className={styles.container}>
        <div className={styles.decisionControls}>
            <Button disabled={quizStatus !== QuizStatus.QUIZ_ANSWERED} onClick={() => {
                Engine.getGameState()
            }} variant={'contained'} className={styles.nextQuiz}>
                Next quiz
            </Button>
            {
                countries.map(country =>
                    <div className={styles.button}>
                        <Button disabled={quizStatus !== QuizStatus.FRESH_QUIZ} variant="contained"
                                onClick={() => Engine.handleAnswer(country.name)}>
                            {country.name}
                        </Button>
                    </div>
                )
            }
        </div>
    </div>
)}