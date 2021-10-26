import * as React from "react";
import {DecisionControls} from "../components/DecisionControls";
import {ApiClient} from "../utils/ApiClient";
import {useEffect, useState} from "react";
import {GameState} from "../model";
import {CircularProgress} from "@mui/material";
import {Plots} from "../components/Plots";


export const GameView: React.FC = () => {
    const [state, setState] = useState<GameState>({} as GameState)
    const [loading, setLoading] = useState<Boolean>(true)

    async function getGameState() {
        try {
            setLoading(true)
            const res = await ApiClient.getQuizGameState()
            setState(res)
        } catch (e) {
            console.log('Error on getting game state', e)
        }
        finally {
            setLoading(false)
        }
    }


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