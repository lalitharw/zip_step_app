import { db } from "./initDatabase"

type ActivityInput = {
    startedAt: string | null,
}

type Activity = {
    id: number,
    serverId: number | null,
    status: string,
    startedAt: string,
    stoppedAt: string | null,
    inactivityNotificationSent: number,
    synced: number
}

export async function createActivity() {
    const result = await db.runAsync(`
            INSERT INTO activities
            (started_at)
            VALUES (?)
        `, new Date().toISOString())

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

export async function updateActivityServerId(activityId: number, serverId: number) {
    await db.runAsync(`
            UPDATE activities 
            SET server_id = ?
            WHERE id = ?
        `, serverId, activityId)
}


export async function markActivityAsSynced(activityId: number) {
    await db.runAsync(`
        UPDATE activities
        SET synced = 1
        WHERE id = ?
        `, activityId)
}

