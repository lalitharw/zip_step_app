import * as SQLite from "expo-sqlite"

export const db = SQLite.openDatabaseSync("stride_flow.db")

export  function initDatabase() {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            server_id INTEGER NULL,
            client_id TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL DEFAULT 'running'
                CHECK (status IN ('completed', 'cancelled','running')),
            started_at TEXt NULL,
            stopped_at TEXt NULL,
            inactivity_notification_sent INTEGER DEFAULT 0,
            synced INTEGER DEFAULT 0
        );`)

     db.execAsync(`
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
        `)
}