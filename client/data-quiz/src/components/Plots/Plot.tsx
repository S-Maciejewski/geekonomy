import * as React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";
import {IndicatorData, LastAnswer} from "../../model";
import {StandardProps} from "../types";
import styles from './Plots.module.scss'
import {useTranslation} from "react-i18next";
import {XrangePointOptionsObject} from "highcharts";
import {getWindowDimensions} from "../../services/utils";
import i18n from 'i18next'

export interface PlotProps {
    countriesData: IndicatorData[]
    lastAnswer?: LastAnswer
    options?: Highcharts.Options
}

export const Plot: React.FC<PlotProps & StandardProps> = ({countriesData, options, lastAnswer}) => {
    const {t} = useTranslation()
    const {width} = getWindowDimensions()

    const getMarkerRadius = () => {
        if (width >= 1180) {
            return 4
        } else if (width >= 600) {
            return 3
        } else {
            return 2
        }
    }

    const divideLabelValue = (value: number, divider: number) => {
        return parseFloat((value / divider).toFixed(1))
    }
    const axisLabelFormatter = (itemValue: number | string): string => {
        const currentLanguage = i18n.language
        const value = itemValue as number
        if (currentLanguage === 'en') {
            if (value >= 1_000_000_000_000) {
                return `${divideLabelValue(value, 1_000_000_000_000)} T`
            } else if (value >= 1_000_000_000) {
                return `${divideLabelValue(value, 1_000_000_000)} B`
            } else if (value >= 1_000_000) {
                return `${divideLabelValue(value, 1_000_000)} M`
            } else if (value >= 1_000) {
                return `${divideLabelValue(value, 1_000)} K`
            }
        } else if (currentLanguage === 'pl') {
            if (value >= 1_000_000_000_000) {
                return `${divideLabelValue(value, 1_000_000_000_000)} t`
            } else if (value >= 1_000_000_000) {
                return `${divideLabelValue(value, 1_000_000_000)} mld`
            } else if (value >= 1_000_000) {
                return `${divideLabelValue(value, 1_000_000)} mln`
            } else if (value >= 1_000) {
                return `${divideLabelValue(value, 1_000)} tys`
            }
        }
        return itemValue.toString()
    }

    const series = lastAnswer && countriesData.length > 1 ? countriesData.map((indicator: IndicatorData) => ({
            name: t(`country.${indicator.country}`),
            data: indicator.series as Partial<XrangePointOptionsObject>,
            type: 'line',
            color: indicator.country === lastAnswer.correctCountry ? '#006ABD' : undefined,
            lineWidth: indicator.country === lastAnswer.correctCountry ? 2 : 1,
            marker: {
                enabled: indicator.country === lastAnswer?.correctCountry,
                symbol: 'circle',
                radius: getMarkerRadius(),
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
                    symbol: 'circle',
                    radius: getMarkerRadius(),
                }
            }
        ]

    const highchartsOptions: Highcharts.Options = {
        title: {
            text: t(`indicator.${countriesData[0].indicator}`)
        },
        // @ts-ignore
        series: series,
        legend: {
            enabled: false
        },
        yAxis: {
            title: {
                text: undefined,
            },
            labels: {
                formatter: (item) => axisLabelFormatter(item.value)
            }
        },
        ...options
    }

    return <div className={styles.plot}>
        <HighchartsReact className={styles.highcharts} highcharts={Highcharts} options={highchartsOptions}/>
    </div>
}
