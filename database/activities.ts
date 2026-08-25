import * as Crypto from "expo-crypto"
import { db } from "./initDatabase"

type ActivityInput = {
    startedAt: string,
    client_id: string
}

type Activity = {
    id: number,
    server_id: number | null,
    status: string,
    started_at: string,
    stopped_at: string | null,
    inactivity_notification_sent: number,
    client_id: string | null,
    synced: number
}

export async function createActivity() {
    const result = await db.runAsync(`
            INSERT INTO activities
            (started_at,client_id)
            VALUES (?,?)
        `, new Date().toISOString(),
        Crypto.randomUUID()
    )

    return result.lastInsertRowId
}


export async function getAllActivity(): Promise<Activity[] | null> {
    return db.getAllAsync<Activity>(`
            SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, synced
            FROM activities`)
}

export async function getActivity(activityId: number): Promise<Activity | null> {
    return db.getFirstAsync<Activity>(`
            SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, synced
            FROM activities WHERE id = ?
        `, activityId)
}

export async function getActiveActivity(activityId: number): Promise<Activity | null> {
    return db.getFirstAsync<Activity>(`
        SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, synced
            FROM activities WHERE id = ? AND status = 'active'
        `, activityId)
}

export async function getUnsyncedActivities(): Promise<Activity[] | null> {
    return db.getAllAsync<Activity>(`
            SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, synced, 
            client_id
            FROM activities WHERE synced = 0 AND status = 'completed'
            ORDER BY id ASC
        `)
}

export async function completeActivity(activityId: number) {
    const result = await db.runAsync(`
            UPDATE activities
            SET status = 'completed',
            stopped_at = ?
            WHERE id = ?
            
        `, new Date().toISOString(),
        activityId
    )

    return result.changes > 0
}

export async function updateInactivityNotificationStatus(activityId: number, value: boolean) {
    await db.runAsync(`
            UPDATE activities
            SET inactivity_notification_sent = ?
            WHERE id = ?
        `,
        value ? 1 : 0, activityId
    )
}

export async function updateActivityServerId(clientId: number, serverId: number) {
    await db.runAsync(`
            UPDATE activities 
            SET server_id = ?
            WHERE client_id = ?
        `, serverId, clientId)
}


export async function markActivityAsSynced(clientId: number) {
    await db.runAsync(`
        UPDATE activities
        SET synced = 1
        WHERE client_id = ?
        `, clientId)
}

