import {Button} from "@mui/material";
import React from "react";
import {ControlsState, Country} from "../../model";
import styles from './DecisionControls.module.scss'
import {Engine} from "../../services/Engine";

export interface ControlsProps {
    countries: Country[]
    controlsState: ControlsState
}

export const DecisionControls: React.FC<ControlsProps> = ({countries, controlsState}) => {

    return <>
        <div className={styles.decisionControls}>
            {
                countries.map(country =>
                    <div className={styles.button}>
                        <Button disabled={controlsState !== ControlsState.DECISION_ENABLED} variant="contained"
                                onClick={() => Engine.handleAnswer(country.name)}>
                            {country.name}
                        </Button>
                    </div>
                )
            }
        </div>
        {
            controlsState === ControlsState.NEXT_QUIZ &&
            <Button onClick={() => {
            }}>
                Next quiz
            </Button>
        }
        {
            controlsState === ControlsState.NEW_GAME &&
            <Button onClick={() => {
            }}>
                New game
            </Button>
        }
    </>
}