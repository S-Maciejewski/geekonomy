import React from "react";
import {CircularProgress} from "@mui/material";
import styles from './Loading.module.scss'

export const Loading: React.FC = () => {
    return <>
        <div className={styles.loading}>
            <div>
                <CircularProgress size={80} className={styles.circularProgress}/>
                <div>
                    Waiting for server response, please wait...
                </div>
            </div>

        </div>
    </>
}