import * as Crypto from "expo-crypto"
import { db } from "./initDatabase"

export type activityPause = {
    id: number,
    client_id: string,
    server_id: number | null
    pause_at: string,
    resume_at: string | null,
    activity_id: number
}


export async function storePauseAt(activityId: number): Promise<number> {
    try {
        const result = await db.runAsync(`
                INSERT INTO activity_pauses (client_id, pause_at,activity_id)
                VALUES(?,?,?)
            `, Crypto.randomUUID(), new Date().toISOString(), activityId)
        return result.lastInsertRowId
    }
    catch (error) {
        console.error("DB Error: ", error)
        throw error
    }
}


export async function storeResumeAt(activityPauseId: number) {
    console.log("Calling Resume Activity")
    try {
        await db.runAsync(`
            UPDATE activity_pauses SET resume_at = ?
            WHERE id = ?
            `, new Date().toISOString(), activityPauseId)

    }
    catch (error) {
        console.error("DB Error: ", error)
    }
}

export async function getUnsyncedActivityPauses(): Promise<activityPause[] | null> {
    try {
        return await db.getAllAsync<activityPause>(`
                SELECT id, activity_id, client_id, resume_at, pause_at
                FROM activity_pauses
                WHERE synced = 0 AND resume_at IS NOT NULL
                ORDER BY id ASC  
            `)

    }
    catch (error) {
        console.error("DB Error: ", error)
        throw error
    }
}

export async function markActivityPauseAsSynced(clientId: string) {
    try {
        await db.runAsync(
            `
            UPDATE activity_pauses 
            SET synced = 1
            WHERE client_id = ?
            `
            , clientId)
    }
    catch (error) {
        console.error("DB Error:", error)
        throw error
    }
}

export async function updateActivityPauseServerId(clientId: string, serverId: number) {
    try {
        await db.runAsync(`
                UPDATE activity_pauses
                SET server_id = ?
                WHERE client_id = ?
            `, serverId, clientId)
    }
    catch (error) {
        console.log("DB Error: ", error)
        throw error
    }
}
