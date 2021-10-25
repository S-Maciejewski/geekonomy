import {UserSession} from "./model";
import {GameState} from "./GameState";
import {randomUUID} from "crypto";

export class Session {
    sessions: UserSession[]

    constructor() {
        this.sessions = []
        console.log(`Sessions list initialized`)
    }

    getById(sessionId: string): UserSession {
        return this.sessions.filter(session => session.sessionId === sessionId)[0]
    }

    createSession(): void {
        const session = {
            sessionId: randomUUID(),
            state: new GameState()
        }
        this.sessions.push(session)
        console.log(`A new session created: ${session.sessionId}`)
    }

    deleteSession(sessionId: string): void {
        this.sessions = this.sessions.filter(session => session.sessionId !== sessionId)
    }
}