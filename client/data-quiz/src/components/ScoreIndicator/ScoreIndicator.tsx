import React from "react";
import {LastAnswer, QuizStatus} from "../../model";
import styles from './ScoreIndicator.module.scss'
import {useTranslation} from "react-i18next";
import ScoreIconSvg from "../../assets/score-icon.svg";

export interface ScoreProps {
    score: number
    lastAnswer?: LastAnswer
    quizStatus: QuizStatus
}

const prettyPrint = (lastAnswer: LastAnswer, t: Function) => {
    return lastAnswer.correct ?
        <span>{t('score.correct')}</span> :
        <span>{t('score.incorrect.1')} <b>{t(`country.${lastAnswer.correctCountry}`)}</b> {t('score.incorrect.2')}
            <i>{t(`country.${lastAnswer.country}`)}</i></span>
}

export const ScoreIndicator: React.FC<ScoreProps> = ({score, lastAnswer, quizStatus}) => {
    const {t} = useTranslation()

    return (
        <div className={styles.container}>
            <div className={styles.score}>
                <span>
                    <img src={ScoreIconSvg} alt="" className={styles.scoreIcon}/>
                    {t('score')}: <b>{score}</b></span>
            </div>
            <div>
                {
                    lastAnswer && quizStatus === QuizStatus.QUIZ_ANSWERED &&
                    <span>{prettyPrint(lastAnswer, t)}</span>
                }
            </div>
        </div>)
}
