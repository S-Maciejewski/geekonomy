import React from "react";
import {CircularProgress} from "@mui/material";
import styles from './Loading.module.scss'
import {ServerAddress} from "../ServerAddress/ServerAddress";
import {useTranslation} from "react-i18next";

export const Loading: React.FC = () => {
    const {t} = useTranslation()

    return <>
        <div className={styles.loading}>
            <div>
                <CircularProgress size={80} className={styles.circularProgress}/>
                <div className={styles.message}>
                    {t('loading')}
                    <ServerAddress/>
                </div>
            </div>

        </div>
    </>
}