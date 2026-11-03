import * as Crypto from "expo-crypto";
import { db } from "./initDatabase";

type LocationPointInput = {
    activityId: number,
    heading: number,
    latitude: number,
    longitude: number,
    accuracy?: number | null,
    altitude: number,
    speed?: number | null,
    timestamp: string,
    raw_latitude: number,
    raw_longitude: number,
    user_id: number
}

export type LocationPoint = {
    id: number,
    activityId: number,
    latitude: number,
    longitude: number,
    accuracy: number,
    altitude: number,
    heading: number,
    client_id: string | null,
    speed: number,
    timestamp: string,
    sync_status: number,
    raw_latitude: number,
    raw_longitude: number,
    user_id: number,
    elevation_gain: number,
    elevation_loss: number
}

// *insert points operation

export async function saveLocationPoint(
    point: LocationPointInput
): Promise<number | null> {
    const result = await db.runAsync(
        `
        INSERT INTO location_points
        (
            activity_id,
            client_id,
            latitude,
            longitude,
            accuracy,
            altitude,
            speed,
            timestamp,
            heading,
            raw_latitude,
            raw_longitude,
            user_id,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(activity_id, timestamp) DO NOTHING
        `,
        point.activityId,
        Crypto.randomUUID(),
        point.latitude,
        point.longitude,
        point.accuracy ?? null,
        point.altitude,
        point.speed ?? null,
        point.timestamp,
        point.heading,
        point.raw_latitude,
        point.raw_longitude,
        point.user_id,
        new Date().toISOString()
    );

    // No row was inserted (duplicate activity + timestamp).
    if (result.changes === 0) {
        return null;
    }

    return result.lastInsertRowId;
}


export async function getLastLocationPoint(activityId: number): Promise<LocationPoint | null> {
    const data = await db.getFirstAsync<LocationPoint>(
        `
            SELECT id,
            activity_id AS activityId,
            latitude,
            longitude,
            accuracy,
            altitude,
            speed,
            timestamp,
            sync_status
            FROM location_points
            WHERE activity_id = ?
            AND is_deleted = 0
            ORDER BY id DESC
            LIMIT 1
        `,
        activityId
    )

    return data
}

export async function getNewLocationPointsById(activityId: number, lastLoadedPointId: number): Promise<LocationPoint[]> {
    return db.getAllAsync<LocationPoint>(`
        SELECT id,
            activity_id AS activityId,
            latitude,
            longitude,
            accuracy,
            altitude,
            speed,
            timestamp,
            sync_status
            FROM location_points
            WHERE activity_id = ?
            AND id > ?
            ORDER BY id ASC
        `, activityId, lastLoadedPointId)
}


export async function getLocationPoints(activityId: number | string): Promise<LocationPoint[]> {
    return await db.getAllAsync<LocationPoint>(`
            SELECT id,
            activity_id AS activityId,
            latitude,
            longitude,
            accuracy,
            altitude,
            speed,
            heading,
            timestamp,
            raw_latitude,
            raw_longitude,
            sync_status
            FROM location_points
            WHERE activity_id = ?
            ORDER BY timestamp ASC
        `, activityId)
}

export async function getAllLocationPoint() {
    return await db.getAllAsync(`
            SELECT id,
            activity_id AS activityId,
            latitude,
            longitude,
            accuracy,
            altitude,
            speed,
            timestamp,
            sync_status,
            FROM location_points
            ORDER BY id ASC
        `)
}

export async function getUnsyncedLocationPoints(activityId: number): Promise<LocationPoint[]> {
    return await db.getAllAsync<LocationPoint>(`
         SELECT id,
            activity_id AS activityId,
            latitude,
            longitude,
            client_id,
            accuracy,
            altitude,
            speed,
            timestamp,
            sync_status
            FROM location_points
            WHERE activity_id = ?
            AND sync_status = 'pending'
            ORDER BY id ASC
        `, activityId)
}

export async function markLocationPointsAsSynced(pointIds: number[]) {
    if (pointIds.length === 0) {
        return
    }

    const Ids = pointIds.join(",")
    await db.runAsync(`
            UPDATE location_points
            SET sync_status = 'synced'
            WHERE id IN (${Ids})
        `)
}




export const getLocationPointsUpToId = async (activityId: number, cursor: number) => {
    const result = await db.getAllAsync<LocationPoint>(`
        SELECT * FROM location_points
        WHERE activity_id = ?
        AND  id <= 1
        ORDER BY id ASC
        `, activityId, cursor)

    return result
}

// * Delete operation
export const softDeleteLocationPoints = async (activityId: string) => {
    await db.runAsync(`
        UPDATE location_points
        SET is_deleted = 1,
        deleted_at = ?,
        updated_at = ?
        WHERE activity_id = ?
        `, new Date().toISOString(), new Date().toISOString(), activityId)
}