import * as Crypto from "expo-crypto"
import { db } from "./initDatabase"

type ActivityInput = {
    startedAt: string,
    client_id: string
}

export type Activity = {
    id: number,
    server_id: number | null,
    status: string,
    started_at: string,
    stopped_at: string | null,
    inactivity_notification_sent: number,
    client_id: string | null,
    synced: number,
    map_image_path: string
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
            FROM activities ORDER BY id DESC`)
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


export const getActivitiesWithUnSyncedPoints = async () => {
    const result = await db.getAllAsync<Activity>(
        `
        SELECT DISTINCT a.* 
        FROM activities a
        INNER JOIN location_points lp
        on a.id = lp.activity_id
        WHERE a.server_id IS NOT NULL
        AND lp.synced = 0
        ORDER BY a.id ASC
        `
    )

    return result
}

export const getActivitiesWithUnsyncedActivityPauses = async () => {
    const result = await db.getAllAsync<Activity>(`
        SELECT DISTINCT a.*
        FROM activities a
        INNER JOIN activity_pauses ap
        on a.id = ap.activity_id
        WHERE a.server_id IS NOT NULL AND a.status = 'completed'
        AND ap.synced = 0
        ORDER BY a.id ASC
        `)
    return result
}


export const updateActivityStatusToPause = async (activityId: number) => {
    await db.runAsync(`
        UPDATE activities
        SET status = 'paused'
        WHERE id = ?
        `, activityId)
}

export const updateActivityStatusToResume = async (activityId: number) => {
    await db.runAsync(`
        UPDATE activities
        SET status = 'running'
        WHERE id = ?
        `, activityId)
}


export const getAllActivitiesOnlyIfLocationPointIsPresent = async () => {
    return await db.getAllAsync<Activity>(
        `
        SELECT a.* FROM activities a
        WHERE (SELECT COUNT(*) FROM location_points lp WHERE lp.activity_id = a.id) >= 2
        ORDER BY a.id ASC
        `
    );
};


export const getActivityWithLocationPoints = async (activityId: number) => {
    const activity = await db.getFirstAsync(`
        SELECT * FROM activities WHERE id = ?`, activityId)

    const location_points = await db.getAllAsync(
        `SELECT * FROM location_points WHERE activity_id = ? ORDER BY id ASC`, activityId
    )

    return {
        activity, location_points
    }
}


export const updateImagePath = async (activityId: number, imagePath: string) => {
    await db.runAsync(`
        UPDATE activities
        SET map_image_path = ?
        WHERE id = ?
        `, imagePath, activityId)
}

