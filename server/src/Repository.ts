import {Client, Pool} from 'pg'
import {Country, Indicator, IndicatorData, QuizData} from "./model";

export class Repository {
    // client: Client
    pool: Pool

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.PG_CONNECTION_STRING
        })
        // this.client = new Client({
        //     connectionString: process.env.PG_CONNECTION_STRING
        // })
        // this.client.connect().then(() => {
        //     console.log(`Connected to ${this.client.host}:${this.client.port}/${this.client.database} database`)
        // }).catch(() => {
        //     console.error(`Could not connect to the database`)
        // })
    }

    async fetchSingleCountryQuizData(country: Country, indicators: Indicator[]) {
        const res = this.getIndicatorsData([country.code], indicators.map(indicator => indicator.code))
        return {} as QuizData // TODO: format
    }

    async getIndicatorsData(countries: string[], indicators: string[]) {
        const queryResult = await this.pool.query(` select "Country Name", "Indicator Name", "Country Code", "Year", "Value"
                          from "Data"
                          where "Country Code" in ('${countries.join("','")}')
                            and "Indicator Code" in ('${indicators.join("','")}')`)
    }


}