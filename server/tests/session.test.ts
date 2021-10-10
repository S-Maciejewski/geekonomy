import { Session } from "../src/Session"

describe('server Session', () => {

    let session: Session
    const sessionId = 'test-id'
    beforeEach(() => {
        session = new Session()
    })

    test('should create user session', async () => {
        session.createSession(sessionId)
        expect(session.sessions).toHaveLength(1)
    })

    test('should retrieve user session by id', async () => {
        session.createSession(sessionId)
        const userSession = session.getById(sessionId)
        expect(userSession.sessionId).toEqual(sessionId)
        expect(userSession).toHaveProperty('state')
    })

    test('should delete user session by id', async () => {
        session.createSession(sessionId)
        expect(session.sessions).toHaveLength(1)
        session.deleteSession(sessionId)
        expect(session.sessions).toHaveLength(0)
    })

})
