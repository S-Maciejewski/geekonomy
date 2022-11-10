import {Button, CircularProgress} from "@mui/material";
import React from "react";
import {Country, LastAnswer, QuizStatus} from "../../model";
import styles from './DecisionControls.module.scss'
import {Engine} from "../../services/Engine";
import {useTranslation} from "react-i18next";
import {ReactComponent as FastForwardFillIcon} from "../../assets/fast-forward-fill.svg";

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

    // Country names length vary from 4 to 30 characters for ENG (VCT) and 33 characters for PL (STP)
    return (
        <div className={styles.container}>
            <div className={styles.decisionControls}>
                <div className={styles.loadingIndicatorContainer}>
                    {controlsDisabledForLoading() && <CircularProgress size={25}/>}
                </div>
                <Button disabled={controlsDisabledForLoading() || quizStatus !== QuizStatus.QUIZ_ANSWERED}
                        onClick={() => {
                            Engine.getGameState()
                        }} variant={'contained'} className={styles.nextQuiz} startIcon={<FastForwardFillIcon/>}>
                    <span className={styles.nextQuizText}>{t('controls.next_quiz')}</span>
                </Button>
                {
                    countries.map(country =>
                        <div className={styles.button}>
                            <Button disabled={controlsDisabledForLoading() || quizStatus !== QuizStatus.FRESH_QUIZ}
                                    variant="contained"
                                    onClick={() => Engine.handleAnswer(country)}
                                    className={getStyle(quizStatus, country)}>
                                {t(`country.${country}`)}

                                {/*{t(`country.STP`)}*/}
                                {/*{t(`country.VCT`)}*/}
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
