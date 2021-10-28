import * as React from 'react'
import {IndicatorData} from "../../model";
import {Plot} from "./Plot";
import styles from './Plots.module.scss'
import {StandardProps} from "../types";

export interface PlotsProps {
    indicators: IndicatorData[]
}

export const Plots: React.FC<PlotsProps & StandardProps> = ({indicators}) => {
    return <div className={styles.plots}>
        {
            indicators.map((indicator => <Plot data={indicator}/>))
        }
    </div>
}
