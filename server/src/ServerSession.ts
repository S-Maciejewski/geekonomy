import {Highscore, UserSession} from "./model";
import {GameState} from "./GameState";
import {randomUUID} from "crypto";
import {Logger} from "./Logger";

export class ServerSession {
    CLEANUP_JOB_PERIOD = 60_000
    SESSION_TIMEOUT_SEC: number
    userSessions: UserSession[]
    highscoreList: Highscore[]

    constructor(SESSION_TIMEOUT_SEC: number) {
        this.SESSION_TIMEOUT_SEC = SESSION_TIMEOUT_SEC
        this.userSessions = []
        this.highscoreList = []
        Logger.info(`Sessions list initialized`)
        this.sessionCleanupJob()
    }

    private sessionCleanupJob = () => {
        setTimeout(this.sessionCleanupJob, this.CLEANUP_JOB_PERIOD)
        const timedOut = this.userSessions.filter(session => Date.now() - session.activeAt > this.SESSION_TIMEOUT_SEC * 1_000).map(session => session.sessionId)
        if (timedOut.length) {
            Logger.info('Removing timed out sessions:', timedOut)
            timedOut.forEach(sessionId => this.deleteSession(sessionId))
        }
    }

    getById(sessionId: string): UserSession {
        const session = this.userSessions.filter(session => session.sessionId === sessionId)[0]
        if (session) session.activeAt = Date.now()
        return session
    }

    createNewSessionAndGetId(): string {
        const session = {
            sessionId: randomUUID(),
            activeAt: Date.now(),
            state: new GameState(),
            highscore: {
                score: 0
            }
        }
        this.userSessions.push(session)
        Logger.info(`Session created: ${session.sessionId}, total sessions: ${this.userSessions.length}`)
        return session.sessionId
    }

    deleteSession(sessionId: string): void {
        this.userSessions = this.userSessions.filter(session => session.sessionId !== sessionId)
        Logger.info(`Session deleted: ${sessionId}, total sessions: ${this.userSessions.length}`)
    }

    getHighscoreList(): Highscore[] {
        return this.highscoreList
    }

    updateHighscoreList(highscore: Highscore) {
        this.highscoreList.push(highscore)
        this.highscoreList = this.highscoreList.sort((a, b) => b.score - a.score).slice(0, 10)
    }

    handleHighscore(userSession: UserSession, score: number) {
        if (score > userSession.highscore.score) {
            userSession.highscore.score = score
            userSession.highscore.achievedAt = Date.now()
            userSession.highscore.sessionId = userSession.sessionId
            this.updateHighscoreList(userSession.highscore)
        }
    }

}
