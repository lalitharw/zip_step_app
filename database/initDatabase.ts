import * as SQLite from "expo-sqlite"

export const db = SQLite.openDatabaseSync("stride_flow.db")

export function initDatabase() {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            server_id INTEGER NULL,
            client_id TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL DEFAULT 'running'
                CHECK (status IN ('completed', 'paused', 'running')),
            started_at TEXT NULL,
            stopped_at TEXT NULL,
            distance INTEGER NULL,
            duration INTEGER NULL,
            average_speed INTEGER NULL,
            average_pace INTEGER NULL,
            elevation_gain INTEGER NULL,
            elevation_loss INTEGER NULL,
            current_elevation INTEGER NULL,
            max_speed INTEGER NULL,
            map_image_path TEXT NULL,
            map_image_url TEXT NULL,
            inactivity_notification_sent INTEGER DEFAULT 0,
            synced INTEGER DEFAULT 0
            
        );`)

    db.execAsync(`
         CREATE TABLE IF NOT EXISTS location_points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            activity_id INTEGER NOT NULL,
            client_id TEXT NOT NULL UNIQUE,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            raw_latitude REAL NOT NULL,
            raw_longitude REAL NOT NULL,
            heading REAL NOT NULL,
            accuracy REAL,
            altitude REAL, --this is gps reading
            relative_altitude REAL NULL, --this is barometer senser reading
            speed REAL,
            timestamp TEXT NOT NULL,
            synced INTEGER DEFAULT 0
        )
        `)

    db.execAsync(`
        CREATE TABLE IF NOT EXISTS activity_pauses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            activity_id INTEGER NOT NULL,
            client_id TEXT NOT NULL UNIQUE,
            pause_at TEXT NULL,
            resume_at TEXT NULL,
            synced INTEGER DEFAULT 0
        )
        `)
}