import { pauses } from "@/common/types/server"
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
            sync_status = 'pending'
            WHERE activity_id = ?
            `, new Date().toISOString(), new Date().toISOString(), activityId)
    }
    catch (error) {
        console.error("DB Error: ", error)
        throw error
    }
}

// * save data from server to local db
export async function saveServerActivityPause(activity: pauses, activity_id: number | string) {
    const existing = await db.getFirstAsync<{ id: number, sync_status: string }>(`
            SELECT id, sync_status
            FROM activity_pauses
            WHERE client_id = ?
        `, activity.client_id)


    if (!existing) {
        await db.runAsync(`
            INSERT INTO activity_pauses
            (activity_id,user_id,client_id,pause_at,resume_at,sync_status,created_at,deleted_at,updated_at,is_deleted)
            VALUES(?,?,?,?,?,?,?,?,?,?)`,
            activity_id,
            activity.user_id,
            activity.client_id,
            activity.pause_at,
            activity.resume_at,
            "synced",
            activity.created_at,
            activity.deleted_at,
            activity.updated_at,
            activity.deleted_at ? 1 : 0
        )
        return
    }

    if (existing.sync_status !== "synced") {
        await db.runAsync(`
                UPDATE activity_pauses
                SET server_id = ?
                WHERE id = ?
            `, activity.id, existing.id)
        return
    }

    await db.runAsync(`
            UPDATE activity_pauses SET
            user_id = ?,
            activity_id = ?,
            pause_at = ?,
            resume_at = ?,
            is_deleted = ?,
            created_at = ?,
            updated_at = ?,
            deleted_at = ?
            WHERE
            id = ?
        `,
        activity.user_id,
        activity_id,
        activity.pause_at,
        activity.resume_at,
        activity.deleted_at ? 1 : 0,
        activity.created_at,
        activity.updated_at,
        activity.deleted_at,
        existing.id
    )
}