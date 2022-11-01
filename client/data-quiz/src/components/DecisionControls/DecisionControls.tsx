import {Button, CircularProgress} from "@mui/material";
import React from "react";
import {Country, LastAnswer, QuizStatus} from "../../model";
import styles from './DecisionControls.module.scss'
import {Engine} from "../../services/Engine";
import {useTranslation} from "react-i18next";

export interface ControlsProps {
    countries: Country[]
    lastAnswer?: LastAnswer
    quizStatus: QuizStatus
}

export const DecisionControls: React.FC<ControlsProps> = ({countries, lastAnswer, quizStatus}) => {
    const {t} = useTranslation()

    const controlsDisabledForLoading = () => quizStatus === QuizStatus.REQUEST_SENT
    const getStyle = (quizStatus: QuizStatus, country: Country) => {
        if (quizStatus === QuizStatus.QUIZ_ANSWERED && lastAnswer) {
            if (lastAnswer.country === country) {
                return lastAnswer.correct ? styles.correctAnswer : styles.incorrectAnswer
            } else if (lastAnswer.correctCountry === country) {
                return styles.correctAnswer
            }
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.decisionControls}>
                <div className={styles.loadingIndicatorContainer}>
                    {controlsDisabledForLoading() && <CircularProgress size={25} className={styles.circularProgress}/>}
                </div>
                <Button disabled={controlsDisabledForLoading() || quizStatus !== QuizStatus.QUIZ_ANSWERED}
                        onClick={() => {
                            Engine.getGameState()
                        }} variant={'contained'} className={styles.nextQuiz}>
                    {t('controls.next_quiz')}
                </Button>
                {
                    countries.map(country =>
                        <div className={styles.button}>
                            <Button disabled={controlsDisabledForLoading() || quizStatus !== QuizStatus.FRESH_QUIZ}
                                    variant="contained"
                                    onClick={() => Engine.handleAnswer(country)}
                                    className={getStyle(quizStatus, country)}>
                                {t(`country.${country}`)}
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
