import { Session } from "../src/Session"

describe('server Session tests', () => {

    describe('session CRUD', () => {
        let session: Session
        let sessionId: string

        beforeAll(() => {
            session = new Session(3600)
            session.createSession()
            sessionId = session.sessions[0].sessionId
        })

        test('should create user session', async () => {
            session.createSession()
            expect(session.sessions).toHaveLength(2)
        })

        test('should retrieve user session by id', async () => {
            const userSession = session.getById(sessionId)
            expect(userSession.sessionId).toEqual(sessionId)
            expect(userSession).toHaveProperty('state')
        })

        test('should delete user session by id', async () => {
            session.deleteSession(sessionId)
            expect(session.sessions.find(session => session.sessionId === sessionId)).toBeFalsy()
        })
    })

})
