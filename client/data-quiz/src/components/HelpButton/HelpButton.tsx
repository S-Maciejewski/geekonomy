import {Button} from "@mui/material"
import React from "react"
import styles from './HelpButton.module.scss'
import {ReactComponent as QuestionCircleIcon} from '../../assets/question-circle.svg'
import {useTranslation} from "react-i18next";

export const HelpButton: React.FC = () => {
    const {t} = useTranslation()

    return (
        <div className={styles.container}>
            <Button onClick={() => {
            }} variant="contained" className={styles.helpButton}>
                    <span>
                        {t('help')}
                    </span>
                <QuestionCircleIcon className={styles.icon}/>
            </Button>
        </div>
    )
}
