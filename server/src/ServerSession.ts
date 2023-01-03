import {Highscore, UserSession} from "./model";
import {GameState} from "./GameState";
import {randomUUID} from "crypto";
import {Logger} from "./Logger";
import {deserializeFromFile, serializeToFile} from "./utils";

export class ServerSession {
    CLEANUP_JOB_PERIOD = 60_000
    CACHING_JOB_PERIOD = 10_000
    SESSIONS_CACHE_FILE_PATH = process.env.SESSIONS_CACHE_FILE_PATH || './cache/sessions.json'
    HIGHSCORES_CACHE_FILE_PATH = process.env.HIGHSCORES_CACHE_FILE_PATH || './cache/highscores.json'
    SESSION_TIMEOUT_SEC = 3_600
    userSessions: UserSession[]
    highscoreList: Highscore[]
    lastCachingSessionCount = 0
    MAX_HIGHSCORES = 10
    DEFAULT_PLAYER_TAG = 'ANO'

    constructor(clearUserSessions: boolean = false, clearHighscores: boolean = false) {
        this.SESSION_TIMEOUT_SEC = process.env.SESSION_TIMEOUT_SEC ? parseInt(process.env.SESSION_TIMEOUT_SEC) : this.SESSION_TIMEOUT_SEC
        this.userSessions = clearUserSessions ? [] : this.getUserSessionsFromCache()
        Logger.info(`Sessions list initialized - got ${this.userSessions.length} sessions from cache`)
        this.highscoreList = clearHighscores ? [] : this.getHighscoresFromCache()
        Logger.info(`Highscores list initialized - got ${this.highscoreList.length} entries from cache`)
        this.sessionCleanupJob()
        this.cachingJob()
    }

    private sessionCleanupJob = () => {
        setTimeout(this.sessionCleanupJob, this.CLEANUP_JOB_PERIOD)
        const timedOut = this.userSessions.filter(session => Date.now() - session.activeAt > this.SESSION_TIMEOUT_SEC * 1_000).map(session => session.sessionId)
        if (timedOut.length) {
            Logger.info('Removing timed out sessions:', timedOut)
            timedOut.forEach(sessionId => this.deleteSession(sessionId))
        }
    }

    private cachingJob = () => {
        setTimeout(this.cachingJob, this.CACHING_JOB_PERIOD)
        this.serializeSessionsToCache()
        this.serializeHighscoresToCache()
    }

    private serializeSessionsToCache() {
        serializeToFile(this.SESSIONS_CACHE_FILE_PATH, this.userSessions).then(() => {
            if (this.userSessions.length !== this.lastCachingSessionCount) {
                // To avoid logging on every caching job even when there are no changes in number of sessions
                Logger.info(`Sessions (${this.userSessions.length}) cached to ${this.SESSIONS_CACHE_FILE_PATH}`)
                this.lastCachingSessionCount = this.userSessions.length
            }
        })
    }

    private serializeHighscoresToCache() {
        serializeToFile(this.HIGHSCORES_CACHE_FILE_PATH, this.highscoreList).then(() => {
        })
    }

    private getUserSessionsFromCache(): UserSession[] {
        const deserializedSessions = deserializeFromFile(this.SESSIONS_CACHE_FILE_PATH)
        if (Array.isArray(deserializedSessions)) {
            for (const session of deserializedSessions) {
                session.state = Object.assign(new GameState(), session.state)
            }
            return deserializedSessions
        }
        return []
    }

    private getHighscoresFromCache(): Highscore[] {
        const deserializedHighscores = deserializeFromFile(this.HIGHSCORES_CACHE_FILE_PATH)
        if (Array.isArray(deserializedHighscores)) {
            return deserializedHighscores
        }
        return []
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
        this.highscoreList = this.highscoreList.filter(entry => entry.sessionId !== highscore.sessionId)
        this.highscoreList.push(highscore)
        this.highscoreList = this.highscoreList.sort((a, b) => b.score - a.score || b.achievedAt - a.achievedAt).slice(0, this.MAX_HIGHSCORES)
    }
}
