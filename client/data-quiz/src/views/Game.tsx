import * as React from "react";
import {DecisionControls} from "../components/DecisionControls/DecisionControls";
import {useEffect, useState} from "react";
import {GameState} from "../model";
import {Plots} from "../components/Plots/Plots";
import {store} from "../store/store";
import {Engine} from "../services/Engine";
import {ScoreIndicator} from "../components/ScoreIndicator/ScoreIndicator";
import {Loading} from "../components/Loading/Loading";
import styles from './Game.module.scss'
import {LanguagePicker} from "../components/LanguagePicker/LanguagePicker";
import GeekonomyLogo from "../assets/geekonomy-logo-long.svg";
import {HelpModal} from "../components/HelpModal/HelpModal";
import {FirstVisitModal} from "../components/FirstVisitModal/FirstVisitModal";
import {GlossaryModal} from "../components/Glossary/GlossaryModal";

export const GameView: React.FC = () => {
    const [state, setState] = useState<GameState>({} as GameState)
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        const getGameState = async () => {
            try {
                setLoading(true)
                await Engine.getGameState()
                setLoading(false)
            } catch (e) {
                console.log('Error on getting game state', e)
                setTimeout(getGameState, 5000)
            }
        }

        getGameState().catch(e => console.log('Error on getting game state', e))

        store.subscribe(() => {
            setState(store.getState())
        })
    }, [])

    return (
        <div>
            <FirstVisitModal/>
            {loading && <Loading/>}
            {!loading && <>
                <div className={styles.controlsContainer}>
                    <div className={styles.rightSide}>
                        <img src={GeekonomyLogo} alt="Geekonomy logo" className={styles.logo}/>
                        <div className={styles.languageAndHelpRow}>
                            <LanguagePicker/>
                            <HelpModal/>
                            <GlossaryModal/>
                        </div>
                    </div>
                    <div>
                        <DecisionControls quizStatus={state.quizStatus} countries={state.countries}
                                          lastAnswer={state.lastAnswer}/>
                    </div>
                    <div>
                        <ScoreIndicator quizStatus={state.quizStatus} score={state.score}
                                        lastAnswer={state.lastAnswer}/>
                    </div>
                </div>
                <Plots indicators={state.indicators} lastAnswer={state.lastAnswer}/>
            </>}
        </div>
    )
}
