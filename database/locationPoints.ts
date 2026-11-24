import { LocationPoints } from "@/common/types/server";
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
            raw_latitude,
            raw_longitude,
            client_id,
            accuracy,
            altitude,
            speed,
            timestamp,
            heading,
            sync_status
            FROM location_points
            WHERE activity_id = ?
            AND sync_status = 'pending'
            AND is_deleted = 0
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
        AND  id <= ?
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
        updated_at = ?,
        sync_status = 'pending'
        WHERE activity_id = ?
        `, new Date().toISOString(), new Date().toISOString(), activityId)
}

// *download and save data from server to local db
export const saveServerLocationPoint = async (locationPoint: LocationPoints, user_id: number, activity_id: number | string) => {
    const existing = await db.getFirstAsync<{ id: number, sync_status: string }>(`
        SELECT id, sync_status 
        FROM location_points
        WHERE client_id = ?
        `, locationPoint.client_id)


    if (!existing) {
        await db.runAsync(`
                INSERT INTO location_points
                (
                    user_id,
                    activity_id,
                    client_id,
                    latitude,
                    longitude,
                    raw_latitude,
                    raw_longitude,
                    heading,
                    accuracy,
                    altitude,
                    speed,
                    timestamp,
                    is_deleted,
                    sync_status,
                    created_at,
                    updated_at,
                    deleted_at
                    
                )

                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,

            user_id,
            activity_id,
            locationPoint.client_id,
            locationPoint.latitude,
            locationPoint.longitude,
            locationPoint.raw_latitude,
            locationPoint.raw_longitude,
            locationPoint.heading,
            locationPoint.accuracy,
            locationPoint.altitude,
            locationPoint.speed,
            locationPoint.point_added,
            locationPoint.deleted_at ? 1 : 0,
            "synced",
            locationPoint.created_at,
            locationPoint.updated_at,
            locationPoint.deleted_at
        )
        return
    }

    if (existing.sync_status !== "synced") {
        return
    }


    await db.runAsync(`
        UPDATE location_points SET
        user_id = ?,
        client_id = ?,
        latitude = ?,
        longitude = ?,
        raw_latitude = ?,
        raw_longitude = ?,
        timestamp = ?,
        heading = ?,
        accuracy = ?,
        altitude = ?,
        speed = ?,
        is_deleted = ?,
        sync_status = ?,
        created_at = ?,
        updated_at = ?,
        deleted_at = ?
        WHERE id = ?
    `,
        user_id,
        locationPoint.client_id,
        locationPoint.latitude,
        locationPoint.longitude,
        locationPoint.raw_latitude,
        locationPoint.raw_longitude,
        locationPoint.point_added,
        locationPoint.heading,
        locationPoint.accuracy,
        locationPoint.altitude,
        locationPoint.speed,
        locationPoint.deleted_at ? 1 : 0,
        "synced",
        locationPoint.created_at,
        locationPoint.updated_at,
        locationPoint.deleted_at,
        existing.id
    )
} 