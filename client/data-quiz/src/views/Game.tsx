import * as React from "react";
import {Plot} from "../components/Plot";
import {DecisionControls} from "../components/DecisionControls";
import {ApiClient} from "../utils/ApiClient";
import {useEffect, useState} from "react";
import {GameState} from "../model";


export const GameView: React.FC = () => {
    const [state, setState] = useState<GameState>({} as GameState)
    const [loading, setLoading] = useState<Boolean>(true)


    async function getGameState() {
        try {
            setLoading(true)
            const res = await ApiClient.getQuizGameState()
            setState(res)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getGameState()
    }, [])

    return (
        <div>
            {loading && <div>data loading...</div>}
            {!loading && <>
                <Plot data={state.indicators[0]}/>
                <DecisionControls countries={state.countries}/>
            </>}
        </div>
    )
}