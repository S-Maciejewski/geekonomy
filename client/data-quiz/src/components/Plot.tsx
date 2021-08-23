import * as React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";
import {IndicatorData} from "../model";

export interface PlotProps {
    data: IndicatorData
    options?: Highcharts.Options
}

export const Plot: React.FC<PlotProps> = (props: PlotProps) => {
    const highchartsOptions: Highcharts.Options = {
        title: {
            text: props.data.indicatorName
        },
        series: [
            {
                name: props.data.indicatorName,
                // @ts-ignore
                data: props.data.series
            }
        ],
        legend: {
            enabled: false
        },
        ...props.options
    }

    return <HighchartsReact highcharts={Highcharts} options={highchartsOptions}/>
}
