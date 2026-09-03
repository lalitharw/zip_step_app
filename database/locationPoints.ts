import * as Crypto from "expo-crypto";
import { db } from "./initDatabase";

type LocationPointInput = {
    activityId: number,
    latitude: number,
    longitude: number,
    accuracy?: number | null,
    altitude: number,
    speed?: number | null,
    timestamp: string
}

export type LocationPoint = {
    id: number,
    activityId: number,
    latitude: number,
    longitude: number,
    accuracy: number,
    altitude: number,
    client_id: string | null,
    speed: number,
    timestamp: string,
    synced: number,
}

export async function saveLocationPoint(point: LocationPointInput): Promise<void> {
    await db.runAsync(
        `
        INSERT INTO location_points
        (activity_id, client_id,latitude,longitude,accuracy,altitude,speed,timestamp)
        VALUES(?,?,?,?,?,?,?,?)
        `,
        point.activityId,
        Crypto.randomUUID(),
        point.latitude,
        point.longitude,
        point.accuracy ?? null,
        point.altitude ?? null,
        point.speed ?? null,
        point.timestamp
    )
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
            synced
            FROM location_points
            WHERE activity_id = ?
            ORDER BY timestamp DESC
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
            synced
            FROM location_points
            WHERE activity_id = ?
            AND id > ?
            ORDER BY id ASC
        `, activityId, lastLoadedPointId)
}


export async function getLocationPoints(activityId: number): Promise<LocationPoint[]> {
    return await db.getAllAsync<LocationPoint>(`
            SELECT id,
            activity_id AS activityId,
            latitude,
            longitude,
            accuracy,
            altitude,
            speed,
            timestamp,
            synced
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
            synced
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
            synced
            FROM location_points
            WHERE activity_id = ?
            AND synced = 0
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
            SET synced = 1
            WHERE id IN (${Ids})
        `)
}