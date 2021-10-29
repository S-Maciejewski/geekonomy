import {Session} from "inspector";
import {Engine} from "../src/Engine";
import supertest, {Request} from "supertest";
import fastify from "fastify";

describe('main server controller tests', () => {
    let session: Session
    let engine: Engine
    const app = fastify().server

    beforeEach(() => {
        session = new Session()
        engine = new Engine(4, 4)
    })

    test('/quiz should return a valid quiz data', async () => {
        supertest(app)
            .get('/quiz')
            .expect(200)
            .then(res => {
                expect(res.body).toHaveProperty('sessionId')
                expect(res.body.countries).toHaveLength(4)
                expect(res.body.indicators).toHaveLength(4)
                expect(res.body.score).toEqual(0)
            })
    })
})
