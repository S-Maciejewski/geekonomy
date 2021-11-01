import * as React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";
import {IndicatorData} from "../../model";
import {StandardProps} from "../types";
import styles from './Plots.module.scss'
import {useTranslation} from "react-i18next";

export interface PlotProps {
    data: IndicatorData
    options?: Highcharts.Options
}

export const Plot: React.FC<PlotProps & StandardProps> = ({data, options}) => {
    const {t} = useTranslation()
    const highchartsOptions: Highcharts.Options = {
        title: {
            text: t(`indicator.${data.indicator}`)
        },
        series: [
            {
                name: data.indicator,
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
