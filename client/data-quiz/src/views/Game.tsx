import * as React from "react";
import {DecisionControls} from "../components/DecisionControls/DecisionControls";
import {useEffect, useState} from "react";
import {GameState, QuizStatus} from "../model";
import {CircularProgress} from "@mui/material";
import {Plots} from "../components/Plots/Plots";
import {store} from "../store/store";
import {Engine} from "../services/Engine";
import {ScoreIndicator} from "../components/ScoreIndicator/ScoreIndicator";


export const GameView: React.FC = () => {
    const [state, setState] = useState<GameState>({} as GameState)
    const [loading, setLoading] = useState<Boolean>(true)

    // TODO: Handle graceful shutdown if server not found
    async function getGameState() {
        try {
            setLoading(true)
            await Engine.getGameState()
        } catch (e) {
            console.log('Error on getting game state', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getGameState()

        store.subscribe(() => {
            setState(store.getState())
        })
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
                    <ScoreIndicator quizStatus={state.quizStatus} score={state.score} lastAnswer={state.lastAnswer}/>
                    <DecisionControls quizStatus={state.quizStatus} countries={state.countries}/>
                </div>
            </>}
        </div>
    )
}