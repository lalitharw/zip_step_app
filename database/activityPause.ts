import * as Crypto from "expo-crypto"
import { db } from "./initDatabase"

type activityPause = {
    id: number,
    client_id: string,
    pause_at: string,
    resume_at: string | null,
    activity_id: number
}

export async function storePauseAt(activityId: number): Promise<number> {
    try {
        const result = await db.runAsync(`
                INSERT INTO activity_pauses (client_id, pause_at,activity_id)
                VALUES(?,?)
            `, Crypto.randomUUID(), new Date().toISOString(), activityId)

        return result.lastInsertRowId
    }
    catch (error) {
        console.error("DB Error: ", error)
        throw error
    }
}


export async function storeResumeAt(activityPauseId: number) {
    try {
        await db.runAsync(`
            UPDATE activity_points SET resume_at = ?
            WHERE id = ?
            `, new Date().toISOString(), activityPauseId)

    }
    catch (error) {
        console.error("DB Error: ", error)
    }
}