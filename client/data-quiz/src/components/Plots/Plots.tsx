import * as React from 'react'
import {IndicatorData, LastAnswer} from "../../model";
import {Plot} from "./Plot";
import styles from './Plots.module.scss'
import {StandardProps} from "../types";

export interface PlotsProps {
    indicators: IndicatorData[]
    lastAnswer?: LastAnswer
}

export const Plots: React.FC<PlotsProps & StandardProps> = ({indicators, lastAnswer}) => {
    const uniqueIndicators = [...new Set(indicators.map(indicator => indicator.indicator))]
    return (
        <div className={styles.plots}>
            {
                uniqueIndicators.map((uniqueIndicator => <Plot countriesData={indicators.filter(indicator => indicator.indicator === uniqueIndicator)} lastAnswer={lastAnswer}/>))
            }
        </div>
    )
}
