import {UserSession} from "./model";
import {GameState} from "./GameState";
import {randomUUID} from "crypto";

export class Session {
    CLEANUP_JOB_PERIOD = 60_000
    SESSION_TIMEOUT_SEC: number
    sessions: UserSession[]

    constructor(SESSION_TIMEOUT_SEC: number) {
        this.SESSION_TIMEOUT_SEC = SESSION_TIMEOUT_SEC
        this.sessions = []
        console.log(`Sessions list initialized`)
        this.sessionCleanupJob()
    }

    private sessionCleanupJob = () => {
        setTimeout(this.sessionCleanupJob, this.CLEANUP_JOB_PERIOD)
        const timedOut = this.sessions.filter(session => Date.now() - session.activeAt > this.SESSION_TIMEOUT_SEC * 1_000).map(session => session.sessionId)
        if (timedOut.length) {
            console.log('Removing timed out sessions:', timedOut)
            timedOut.forEach(sessionId => this.deleteSession(sessionId))
        }
    }

    getById(sessionId: string): UserSession {
        const session = this.sessions.filter(session => session.sessionId === sessionId)[0]
        if (session) session.activeAt = Date.now()
        return session
    }

    createSession(): void {
        const session = {
            sessionId: randomUUID(),
            activeAt: Date.now(),
            state: new GameState()
        }
        this.sessions.push(session)
        console.log(`Session created: ${session.sessionId}, total sessions: ${this.sessions.length}`)
    }

    deleteSession(sessionId: string): void {
        this.sessions = this.sessions.filter(session => session.sessionId !== sessionId)
        console.log(`Session deleted: ${sessionId}, total sessions: ${this.sessions.length}`)
    }
}