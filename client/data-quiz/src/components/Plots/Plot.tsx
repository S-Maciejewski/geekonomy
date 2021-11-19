import * as React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";
import {IndicatorData, LastAnswer} from "../../model";
import {StandardProps} from "../types";
import styles from './Plots.module.scss'
import {useTranslation} from "react-i18next";
import {XrangePointOptionsObject} from "highcharts";

export interface PlotProps {
    countriesData: IndicatorData[]
    lastAnswer?: LastAnswer
    options?: Highcharts.Options
}

export const Plot: React.FC<PlotProps & StandardProps> = ({countriesData, options, lastAnswer}) => {
    const {t} = useTranslation()

    const series = lastAnswer && countriesData.length > 1 ? countriesData.map((indicator: IndicatorData) => ({
            name: t(`country.${indicator.country}`),
            data: indicator.series as Partial<XrangePointOptionsObject>,
            type: 'line',
            color: indicator.country === lastAnswer.correctCountry ? '#006ABD' : undefined,
            lineWidth: indicator.country === lastAnswer.correctCountry ? 2 : 1,
        marker: {
            enabled: indicator.country === lastAnswer?.correctCountry,
            symbol: 'circle',
        }
        })) :
        [
            {
                name: '???',
                data: countriesData[0].series as Partial<XrangePointOptionsObject>,
                type: 'line',
                color: '#006ABD',
                lineWidth: 2,
                marker: {
                    enabled: true,
                    symbol: 'circle'
                }
            }
        ]

    console.log(series)
    const highchartsOptions: Highcharts.Options = {
        title: {
            text: t(`indicator.${countriesData[0].indicator}`)
        },
        // @ts-ignore
        series: series,
        legend: {
            enabled: false
        },
        ...options
    }

    return <div className={styles.plot}>
        <HighchartsReact className={styles.highcharts} highcharts={Highcharts} options={highchartsOptions}/>
    </div>
}
