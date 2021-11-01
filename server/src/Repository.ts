import {Pool} from 'pg'
import {Country, Indicator, IndicatorData} from "./model";

/*
The Repository class should eventually be independent from the data source.
This means that if the approach without database will be used (using pre-defined quiz sets),
the Repository should have methods to handle this without the Engine knowing about it
 */
export class Repository {
    pool: Pool

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.PG_CONNECTION_STRING
        })
    }

    async fetchSingleCountryQuizData(country: Country, indicators: Indicator[]): Promise<IndicatorData[]> {
        return await this.getIndicatorData([country], indicators)
    }

    async getIndicatorData(countries: string[], indicators: string[]): Promise<IndicatorData[]> {
        try {
            const client = await this.pool.connect()
            const queryResult = await client.query(` select "Indicator Code", "Country Code", "Year", "Value"
                                                     from "Data"
                                                     where "Country Code" in ('${countries.join("','")}')
                                                       and "Indicator Code" in ('${indicators.join("','")}')
                                                     order by "Country Code", "Indicator Code", "Year";`)

            // TODO: Multiple countries
            const indicatorData: IndicatorData[] = indicators.map(indicator => ({
                indicator,
                series: queryResult.rows.filter(row => row['Indicator Code'] === indicator).map(row => [row['Year'] as number, row['Value'] as number])
            }))

            client.release()
            return indicatorData
        } catch (e) {
            console.error('Could not fetch data from Postgres', e)
            return []
        }
    }
}
