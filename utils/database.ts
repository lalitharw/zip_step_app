import * as SecureStore from "expo-secure-store"
import * as SQLite from "expo-sqlite"

export const db = SQLite.openDatabaseSync("stride.db")

export async function initDatabase() {

    await db.execAsync(
        `
        CREATE TABLE IF NOT EXISTS location_points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            activity_id INTEGER NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            accuracy REAL,
            altitude REAL,
            speed REAL,
            timestamp TEXT NOT NULL,
            synced INTEGER DEFAULT 0
        )
        `
    )
}


export async function saveLocationPoints(point: {
    latitude: number,
    longitude: number,
    altitude?: number | null,
    accuracy?: number | null,
    speed?: number | null,
    timestamp: string
}) {
    const ActivityId = await SecureStore.getItemAsync("activity_id")
    try {
        if (!ActivityId) {
            throw new Error("Activity ID not set")
        }
        await db.runAsync(
            `
        INSERT INTO location_points
        (activity_id,latitude,longitude,accuracy,altitude,speed,timestamp) 
        VALUES (?,?,?,?,?,?,?)
        `,
            ActivityId,
            point.latitude,
            point.longitude,
            point.accuracy ?? null,
            point.altitude ?? null,
            point.speed ?? null,
            point.timestamp
        )
    }
    catch (error) {
        // console.error(error.response.data.message)
    }

}

export async function getLocationPoints() {
    const data = await db.getAllAsync(`SELECT * FROM location_points ORDER BY id DESC`)
    return data
}


export async function getLocationPointsById(activity_id: number | null) {
    const data = await db.getAllAsync<{
        latitude: number
        longitude: number,
        accuracy: number | null,
        speed: number | null
    }>("SELECT latitude,longitude,accuracy,speed FROM location_points WHERE activity_id = ? ORDER BY timestamp ASC", activity_id)
    return data
}

export async function getLastLocationPoint(activity_id: number | null) {
    const data = await db.getFirstAsync<{
        latitude: number,
        longitude: number,
        timestamp: string,
        accuracy: number | null
    }>(`
            SELECT latitude, longitude, timestamp,accuracy FROM location_points WHERE activity_id = ?
            ORDER BY timestamp DESC
            LIMIT 1
        `, activity_id)
    return data
}

export async function getNewLocationPointsById(activity_id: number | null, lastId: number | null) {
    if (lastId === null) {
        return await db.getAllAsync<{
            id: number,
            latitude: number,
            longitude: number,
            accuracy: number | null,
            speed: number | null
        }>(`
          SELECT id, latitude, longitude, accuracy, speed FROM location_points
          WHERE activity_id = ? ORDER BY id ASC        
            `, activity_id)
    }

    return await db.getAllAsync<{
        id: number,
        latitude: number,
        longitude: number,
        accuracy: number | null,
        speed: number | null
    }>(`
        SELECT id, latitude, longitude, accuracy, speed FROM location_points
          WHERE activity_id = ? AND id > ? ORDER BY id ASC        
            `, activity_id, lastId)
}



