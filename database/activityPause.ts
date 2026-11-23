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


export async function getActivityPause(activityId: number): Promise<activityPause[]> {
    try {
        return await db.getAllAsync<activityPause>(`
                SELECT id, activity_id, client_id, pause_at, resume_at
                FROM activity_pauses 
                WHERE activity_id = ?
                ORDER BY id ASC
            `, activityId)
    }
    catch (error) {
        console.error("DB Error: ", error)
        throw error
    }
}




export async function storePauseAt({ activityId, userId }: { activityId: number, userId: number }): Promise<number> {
    try {
        const result = await db.runAsync(`
                INSERT INTO activity_pauses (client_id, pause_at,activity_id,user_id)
                VALUES(?,?,?,?)
            `, Crypto.randomUUID(), new Date().toISOString(), activityId, userId)
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
            UPDATE activity_pauses SET resume_at = ?
            WHERE id = ?
            `, new Date().toISOString(), activityPauseId)

    }
    catch (error) {
        console.error("DB Error: ", error)
    }
}

export async function getUnSyncedActivityPause(activityId: number): Promise<activityPause[]> {
    return await db.getAllAsync<activityPause>(`
            SELECT id, activity_id, client_id, pause_at, resume_at
                FROM activity_pauses 
                WHERE activity_id = ?
                AND is_deleted = 0
                ORDER BY id ASC
        `, activityId)
}

export async function markActivityPauseAsSynced(pauseIds: number[]) {
    if (pauseIds.length == 0) return

    try {
        const Ids = pauseIds.join(",")
        await db.runAsync(
            `
            UPDATE activity_pauses 
            SET sync_status = 'synced'
            WHERE id IN (${Ids})
            `)
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


export async function getLastActivityPause(activityId: number | string) {
    try {
        return await db.getFirstAsync(`
                SELECT id, activity_id, client_id, pause_at, resume_at
                FROM activity_pauses
                WHERE activity_id = ?
                ORDER BY id DESC
                LIMIT 1
            `, activityId)
    }
    catch (error) {
        console.error("DB Error: ", error)
        throw error
    }
}


// delete
export async function softDeleteActivityPause(activityId: number | string) {
    try {
        return await db.runAsync(`
            UPDATE activity_pauses
            SET updated_at = ?,
            deleted_at = ?,
            is_deleted = 1,
            sync_status = "pending"
            WHERE activity_id = ?
            `, new Date().toISOString(), new Date().toISOString(), activityId)
    }
    catch (error) {
        console.error("DB Error: ", error)
        throw error
    }
}