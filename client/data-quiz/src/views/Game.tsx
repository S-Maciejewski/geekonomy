import * as React from "react";
import {Plot} from "../components/Plot";
import {DecisionControls} from "../components/DecisionControls";


export const GameView: React.FC = () => {

    return (
        <div>
            <Plot/>
            <DecisionControls/>
        </div>
    )
}