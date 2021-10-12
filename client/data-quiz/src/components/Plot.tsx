import * as React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";
import {IndicatorData} from "../model";
import {StandardProps} from "./types";

export interface PlotProps {
    data: IndicatorData
    options?: Highcharts.Options
}

export const Plot: React.FC<PlotProps & StandardProps> = ({data, options, className}) => {

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

    return <div className={className}>
        <HighchartsReact highcharts={Highcharts} options={highchartsOptions}/>
    </div>
}
