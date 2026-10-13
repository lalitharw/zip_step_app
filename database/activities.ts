import * as Crypto from "expo-crypto"
import { db } from "./initDatabase"

type ActivityInput = {
    startedAt: string,
    client_id: string
}

export type Activity = {
    id: number,
    server_id: number | null,
    user_id: number | null,
    status: string,
    started_at: string,
    stopped_at: string | null,
    inactivity_notification_sent: number,
    client_id: string | null,
    synced: number,
    map_image_path: string,
    distance: number | null,
    duration: number | null,
    average_speed: number | null,
    average_pace: number | null,
    elevation_gain: number | null,
    elevation_loss: number | null,
    current_elevation: number | null,
    max_speed: number | null,
}


export async function createActivity(userId: number | null) {
    const result = await db.runAsync(`
            INSERT INTO activities
            (started_at,client_id,user_id)
            VALUES (?,?,?)
        `, new Date().toISOString(),
        Crypto.randomUUID(), userId
    )

    return result.lastInsertRowId
}


// export async function getAllActivity(): Promise<Activity[] | null> {
//     return db.getAllAsync<Activity>(`
//             SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, synced,
//             distance,
//             duration,
//             average_speed,
//             average_pace,
//             elevation_gain,
//             current_elevation,
//             max_speed
//             FROM activities ORDER BY id DESC`)
// }


export async function getActivity(activityId: number | string): Promise<Activity | null> {
    return db.getFirstAsync<Activity>(`
            SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, synced, 
            distance, duration, average_speed, average_pace, elevation_gain, max_speed
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
            client_id, distance, duration, average_speed, average_pace, elevation_gain, current_elevation, max_speed
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


export const getAllActivitiesOnlyIfLocationPointIsPresent = async (userId: number) => {
    return await db.getAllAsync<Activity>(
        `
        SELECT a.* FROM activities a
        WHERE (SELECT COUNT(*) FROM location_points lp WHERE lp.activity_id = a.id) >= 2
        AND a.status = 'completed' AND a.user_id = ?
        ORDER BY a.id DESC 
        `,
        userId
    );
};




export const updateImagePath = async (activityId: number, imagePath: string) => {
    await db.runAsync(`
        UPDATE activities
        SET map_image_path = ?
        WHERE id = ?
        `, imagePath, activityId)
}


export const updateActivityStats = async (activityId: number, stats: {
    distance: number,
    duration: number,
    averageSpeed: number,
    averagePace: number,
    elevationGain: number,
    currentElevation: number,
    maxSpeed: number
}) => {
    await db.runAsync(`
            UPDATE activities
            SET distance = ?,
            duration = ?,
            average_speed = ?,
            average_pace = ?,
            elevation_gain = ?,
            max_speed = ?
            WHERE id = ?
        `, stats.distance,
        stats.duration,
        stats.averageSpeed,
        stats.averagePace,
        stats.elevationGain,
        stats.maxSpeed,
        activityId)
}

