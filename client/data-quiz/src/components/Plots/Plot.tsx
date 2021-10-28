import * as React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";
import {IndicatorData} from "../../model";
import {StandardProps} from "../types";
import styles from './Plots.module.scss'

export interface PlotProps {
    data: IndicatorData
    options?: Highcharts.Options
}

export const Plot: React.FC<PlotProps & StandardProps> = ({data, options}) => {

    const highchartsOptions: Highcharts.Options = {
        title: {
            text: data.indicator.name
        },
        series: [
            {
                name: data.indicator.name,
                // @ts-ignore
                data: data.series
            }
        ],
        legend: {
            enabled: false
        },
        ...options
    }

    return <div className={styles.plot}>
        <HighchartsReact className={styles.highcharts} highcharts={Highcharts} options={highchartsOptions}/>
    </div>
}
