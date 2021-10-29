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

    return <>
        <div className={styles.decisionControls}>
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
        {
            quizStatus === QuizStatus.QUIZ_ANSWERED &&
            <Button onClick={() => {
                Engine.getGameState()
            }}>
                Next quiz
            </Button>
        }
        {/*// TODO: A reset game button*/}
        {/*<Button onClick={() => {*/}
        {/*}}>*/}
        {/*    New game*/}
        {/*</Button>*/}
    </>
}