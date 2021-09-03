import {Client, Pool} from 'pg'

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



}