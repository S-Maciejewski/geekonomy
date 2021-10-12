import { Button } from "@mui/material";
import React from "react";
import { Country } from "../model";
import styles from './DecisionControls.module.scss'
import {ApiClient} from "../utils/ApiClient";

export interface ControlsProps {
    countries: Country[]
}

export const DecisionControls: React.FC<ControlsProps> = (props: ControlsProps) => {
    async function selectAnswer(answer: string) {
        ApiClient.postQuizAnswer(answer)
    }
    return (
        <div className={styles.decisionControls}>
            {
                props.countries.map(country =>
                    <div className={styles.button}>
                        <Button variant="contained" onClick={() => selectAnswer(country.name)}>{country.name}</Button>
                    </div>
                )
            }
        </div>
    )
}