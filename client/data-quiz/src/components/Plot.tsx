import * as React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";

export type PlotProps = {
    options?: Highcharts.Options
}

export const Plot = ({options}: PlotProps) => {
    // return <HighchartsReact highcharts={Highcharts} options={options ?? {}}/>
    return <>
        plot
    </>

}