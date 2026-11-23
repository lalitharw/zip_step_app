import { ServerActivity } from "@/common/types/server"
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
    sync_status: string,
    map_image_path: string,
    distance: number | null,
    duration: number | null,
    average_speed: number | null,
    last_loaded_location_id: number | null
    average_pace: number | null,
    elevation_gain: number | null,
    elevation_loss: number | null,
    current_elevation: number | null,
    max_speed: number | null,
}


// *create operation
export async function createActivity(userId: number | null) {
    const result = await db.runAsync(`
            INSERT INTO activities
            (started_at,client_id,user_id, created_at)
            VALUES (?,?,?,?)
        `, new Date().toISOString(),
        Crypto.randomUUID(), userId, new Date().toISOString()
    )

    return result.lastInsertRowId
}

// * get all activities as per userId
export async function getAllActivities(userId: number | string): Promise<Activity[] | null> {
    const result = await db.getAllAsync<Activity>(`
            SELECT * FROM activities
            WHERE user_id = ?
        `, userId)

    return result
}


export async function getActivities() {
    const result = await db.getAllAsync<Activity>(`
            SELECT * FROM activities
        `)

    return result
}



export async function getActivity(activityId: number | string): Promise<Activity | null> {
    return db.getFirstAsync<Activity>(`
            SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, last_loaded_location_id, sync_status, 
            distance, duration, average_speed, average_pace, elevation_gain, max_speed
            FROM activities WHERE id = ?
        `, activityId)
}

export async function getActiveActivity(activityId: number): Promise<Activity | null> {
    return db.getFirstAsync<Activity>(`
        SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, sync_status
            FROM activities WHERE id = ? AND status = 'active'
        `, activityId)
}

export async function getUnsyncedActivities(): Promise<Activity[] | null> {
    return db.getAllAsync<Activity>(`
            SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, sync_status, 
            client_id, distance, duration, average_speed, average_pace, elevation_gain, current_elevation, max_speed, map_image_path
            FROM activities WHERE  status = 'completed' AND is_deleted = 0
            ORDER BY id ASC
        `)
}

export async function getUnSyncedDeletedActivities(): Promise<Activity[] | null> {
    return db.getAllAsync<Activity>(`
            SELECT id, server_id, status, started_at, stopped_at, inactivity_notification_sent, sync_status, 
            client_id, distance, duration, average_speed, average_pace, elevation_gain, current_elevation, max_speed
            FROM activities WHERE sync_status = 'pending' AND status = 'completed' AND is_deleted = 1
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

export async function cancelledActivity(activityId: number) {
    const result = await db.runAsync(`
        UPDATE activities
        SET status = 'cancelled',
        stopped_at = ?
        WHERE id = ?
        `, new Date().toISOString(), activityId)
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
        SET sync_status = 'synced'
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
        AND ap.sync_status = 'pending'
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
        WHERE (SELECT COUNT(*) FROM location_points lp WHERE lp.activity_id = a.id) >= 5
        AND a.status = 'completed' AND a.user_id = ? AND a.is_deleted = 0
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


// ------

export const saveLastLoadedLocationIdAndDistance = async (activityId: number, data: { distance: number, lastProcessedPointId: number }) => {
    await db.runAsync(`
            UPDATE activities
            SET last_loaded_location_id = ?,
            distance = ?
            WHERE id = ?
        `, data.lastProcessedPointId, data.distance, activityId)
}

export const getLastLoadedLocationId = async (activityId: number) => {
    const res = await db.getFirstAsync<{ last_processed_location_id: number }>(`
            SELECT last_loaded_location_id
            FROM activities
            WHERE id = ?
        `, activityId)

    return res?.last_processed_location_id ?? 0
}



// *delete operation
export const softDeleteActivity = async (activityId: string) => {
    await db.runAsync(`
            UPDATE activities
            SET is_deleted = 1,
            updated_at = ?,
            deleted_at = ?,
            sync_status = "pending"
            WHERE id = ?
        `, new Date().toISOString(), new Date().toISOString(), activityId)
}

export const hardDeleteActivity = async (clientId: string) => {
    await db.runAsync(`
            DELETE FROM activities
            WHERE client_id = ?
            `, clientId)
}


// *save data from server
export const saveServerActivity = async (activity: ServerActivity): Promise<void> => {
    const existing = await db.getFirstAsync<{ id: number, sync_status: string }>(`
            SELECT id, sync_status
            FROM activities
            WHERE client_id = ?
        `, activity.client_id)

    if (!existing) {
        await db.runAsync(`
                INSERT INTO activities (
                    user_id,
                    server_id,
                    client_id,
                    status,
                    started_at,
                    stopped_at,
                    distance,
                    duration,
                    average_speed,
                    average_pace,
                    elevation_gain,
                    current_elevation,
                    max_speed,
                    map_image_path,
                    is_deleted,
                    sync_status,
                    created_at,
                    deleted_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?, ?)`
            ,
            activity.user_id,
            activity.id,
            activity.client_id,
            "completed",
            activity.start_time,
            activity.end_time,
            activity.distance,
            activity.duration,
            activity.average_speed,
            activity.average_pace,
            activity.elevation_gain,
            activity.current_elevation,
            activity.max_speed,
            activity.map_image_path,
            activity.deleted_at ? 1 : 0,
            activity.created_at,
            activity.deleted_at,
            activity.updated_at
        );

        return;
    }

    if (existing.sync_status !== "synced") {
        await db.runAsync(`
                UPDATE activities
                SET server_id = ?
                WHERE id = ?
            `, activity.id, existing.id)

        return
    }


    await db.runAsync(`
            UPDATE activities SET
            server_id = ?,
            status = ?,
            started_at = ?,
            stopped_at = ?,
            distance = ?,
            duration = ?,
            average_speed = ?,
            average_pace = ?,
            elevation_gain = ?,
            current_elevation = ?,
            max_speed = ?,
            map_image_path = ?,
            is_deleted = ?,
            updated_at = ?,
            deleted_at = ?
         WHERE id = ?`
        ,
        activity.id,
        "completed",
        activity.start_time,
        activity.end_time,
        activity.distance,
        activity.duration,
        activity.average_speed,
        activity.average_pace,
        activity.elevation_gain,
        activity.current_elevation,
        activity.max_speed,
        activity.map_image_path,
        activity.deleted_at ? 1 : 0,
        activity.updated_at,
        activity.deleted_at,
        existing.id
    )
}




