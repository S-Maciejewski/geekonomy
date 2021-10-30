import * as React from "react";
import {DecisionControls} from "../components/DecisionControls/DecisionControls";
import {useEffect, useState} from "react";
import {GameState} from "../model";
import {Plots} from "../components/Plots/Plots";
import {store} from "../store/store";
import {Engine} from "../services/Engine";
import {ScoreIndicator} from "../components/ScoreIndicator/ScoreIndicator";
import {Loading} from "../components/Loading/Loading";


export const GameView: React.FC = () => {
    const [state, setState] = useState<GameState>({} as GameState)
    const [loading, setLoading] = useState<Boolean>(true)

    async function getGameState() {
        try {
            setLoading(true)
            await Engine.getGameState()
            setLoading(false)
        } catch (e) {
            console.log('Error on getting game state', e)
            setTimeout(getGameState, 5000)
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
            {loading && <Loading/>}
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