import { ServerSession } from "../src/ServerSession"

describe('server Session tests', () => {

    describe('session CRUD', () => {
        let serverSession: ServerSession

        beforeAll(() => {
            serverSession = new ServerSession(true)
        })

        test('should create user session', async () => {
            const sessionId = serverSession.createNewSessionAndGetId()
            expect(serverSession.userSessions).toHaveLength(1)
            expect(serverSession.userSessions[0].sessionId).toEqual(sessionId)
        })

        test('should retrieve user session by id', async () => {
            const sessionId = serverSession.createNewSessionAndGetId()
            const userSession = serverSession.getById(sessionId)

            expect(userSession.sessionId).toEqual(sessionId)
            expect(userSession).toHaveProperty('state')

            serverSession.deleteSession(sessionId)
        })

        test('should delete user session by id', async () => {
            const sessionId = serverSession.createNewSessionAndGetId()
            serverSession.deleteSession(sessionId)
            expect(serverSession.userSessions.find(session => session.sessionId === sessionId)).toBeFalsy()
        })
    })

})
