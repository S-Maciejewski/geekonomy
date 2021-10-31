import React from "react";
import {CircularProgress} from "@mui/material";
import styles from './Loading.module.scss'
import {ServerAddress} from "../ServerAddress/ServerAddress";

export const Loading: React.FC = () => {
    return <>
        <div className={styles.loading}>
            <div>
                <CircularProgress size={80} className={styles.circularProgress}/>
                <div className={styles.message}>
                    Waiting for server response, please wait...
                    <ServerAddress/>
                </div>
            </div>

        </div>
    </>
}