import {Engine} from "../src/Engine";
import supertest from "supertest";
import fastify from "fastify";
import { ServerSession } from "../src/ServerSession";

describe('main server controller tests', () => {
    let serverSession: ServerSession
    let engine: Engine
    const app = fastify().server

    beforeEach(() => {
        serverSession = new ServerSession(3600)
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

    test('/quiz should create a new session if no sessionId present', async () => {
        supertest(app)
            .get('/quiz')
            .expect(200)
            .then(res => {
                expect(serverSession.userSessions).toHaveLength(1)
                expect(res.body.sessionId).toEqual(serverSession.userSessions[0].sessionId)
            })
    })
})
