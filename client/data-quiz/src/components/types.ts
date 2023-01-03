export type StandardProps = {
    className?: string
}

export interface Highscore {
    sessionId: string
    achievedAt: number
    score: number
    playerTag: string
}
