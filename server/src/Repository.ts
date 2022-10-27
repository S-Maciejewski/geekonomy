import {Pool} from 'pg'
import {Logger} from './Logger';
import {Country, Indicator, IndicatorData, QuizData} from "./model";
import * as _ from "lodash";
import * as fs from "fs";

const supported = require('../config/supported.json')

/*
The Repository class should eventually be independent from the data source.
This means that if the approach without database will be used (using pre-defined quiz sets),
the Repository should have methods to handle this without the Engine knowing about it
 */

export abstract class Repository {
    abstract getQuizData(countriesCount: number, indicatorCount: number): Promise<QuizData>
}

export class DwhRepository implements Repository {
    pool: Pool

    constructor() {
        this.pool = new Pool({
            // connectionString: process.env.PG_CONNECTION_STRING || `postgres://${process.env.DWH_USER}:${process.env.DWH_PASSWORD}@${process.env.DWH_HOST}:${process.env.DWH_PORT}/postgres`
            connectionString: process.env.PG_CONNECTION_STRING
        })
    }

    async getQuizData(countriesCount: number, indicatorCount: number): Promise<QuizData> {
        const randomCountries: Country[] = _.sampleSize(supported.countries, countriesCount)
        const randomIndicators: Indicator[] = _.sampleSize(supported.indicators, indicatorCount)
        const correctCountry = _.sample(randomCountries) as Country
        return ({
            indicators: await this.getIndicatorData(randomCountries, randomIndicators),
            countries: randomCountries,
            correctCountry
        })
    }

    // TODO: Improve how much data is filled. Maybe take number of metrics +2 and discard ones with least fill for the country?
    async getIndicatorData(countries: string[], indicators: string[]): Promise<IndicatorData[]> {
        try {
            const client = await this.pool.connect()
            const queryResult = await client.query(` select "Indicator Code", "Country Code", "Year", "Value"
                                                     from "Data"
                                                     where "Country Code" in ('${countries.join("','")}')
                                                       and "Indicator Code" in ('${indicators.join("','")}')
                                                     order by "Country Code", "Indicator Code", "Year";`)

            const indicatorData: IndicatorData[] = indicators.flatMap(indicator => (countries.map(country =>
                    ({
                        indicator,
                        country,
                        series: queryResult.rows.filter(row => row['Indicator Code'] === indicator && row['Country Code'] === country).map(row => [row['Year'] as number, row['Value'] as number])
                    })
                ))
            )

            client.release()
            return indicatorData
        } catch (e) {
            Logger.error('Could not fetch data from Postgres', e)
            return []
        }
    }
}

export class PreGeneratedRepository implements Repository {
    preGeneratedFiles: string[]
    path: string;

    constructor() {
        this.path = process.env.QUIZ_DATA_PATH || '../quiz_data'
        this.preGeneratedFiles = fs.readdirSync(this.path)
        Logger.info(`Repository running with access to ${this.preGeneratedFiles.length} pre generated quiz files`)
    }

    getRandomFileName(): string {
        const randomQuiz = _.sampleSize(this.preGeneratedFiles, 1)[0];
        Logger.info(`Repository - fetching random quiz: ${randomQuiz}`)
        return randomQuiz
    }

    async getQuizData(countriesCount: number, indicatorCount: number): Promise<QuizData> {
        return JSON.parse(fs.readFileSync(`${this.path}/${this.getRandomFileName()}`, 'utf8'))
    }

}