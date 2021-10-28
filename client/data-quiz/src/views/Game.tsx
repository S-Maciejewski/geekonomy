import * as React from "react";
import {DecisionControls} from "../components/DecisionControls";
import {ApiClient} from "../services/ApiClient";
import {useEffect, useState} from "react";
import {GameState} from "../model";
import {CircularProgress} from "@mui/material";
import {Plots} from "../components/Plots";
import { store } from "../store/store";


export const GameView: React.FC = () => {
    const [state, setState] = useState<GameState>({} as GameState)
    const [loading, setLoading] = useState<Boolean>(true)

    async function getGameState() {
        try {
            setLoading(true)
            await ApiClient.getQuizGameState()
            setState(store.getState())
        } catch (e) {
            console.log('Error on getting game state', e)
        }
        finally {
            setLoading(false)
        }
    }
    // TODO: Subscribe to score changes

    useEffect(() => {
        getGameState()
    }, [])

    return (
        <div>
            {loading &&
            <div>
                <CircularProgress/>
                data loading...
            </div>}
            {!loading && <>
                <Plots indicators={state.indicators}/>
                <div>
                    Score: {state.score}
                    <DecisionControls countries={state.countries}/>
                </div>
            </>}
        </div>
    )
}