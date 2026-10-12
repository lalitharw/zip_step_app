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
            
        );
        
        CREATE INDEX IF NOT EXISTS idx_activities_user
        ON activities(user_id)
        `)

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
            elevation_gain REAL NULL,
            elevation_loss REAL NULL,
            heading REAL NOT NULL,
            accuracy REAL,
            altitude REAL, --this is gps reading
            relative_altitude REAL NULL, --this is barometer senser reading
            speed REAL,
            timestamp TEXT NOT NULL,
            synced INTEGER DEFAULT 0,

            FOREIGN KEY (activity_id)
            REFERENCES activities(id)
            ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_location_points_user
        ON location_points(user_id,activity_id)


        `)

    db.execAsync(`
        CREATE TABLE IF NOT EXISTS activity_pauses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            activity_id INTEGER NOT NULL,
            client_id TEXT NOT NULL UNIQUE,
            pause_at TEXT NULL,
            resume_at TEXT NULL,
            synced INTEGER DEFAULT 0,

            FOREIGN KEY(activity_id)
            REFERENCES activities(id)
            ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_activity_pauses_user
        ON activity_pauses(user_id,activity_id)

        
        `)

    db.execAsync(`
            CREATE TABLE IF NOT EXISTS activity_elevations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                activity_id INTEGER NOT NULL,

                latitude REAL NOT NULL,
                longitude REAL NOT NULL,

                elevation REAL NOT NULL,
                recorded_at TEXT NOT NULL,

                source TEXT DEFAULT 'open_meteo',

                synced INTEGER DEFAULT 0,

                FOREIGN KEY (activity_id)
                REFERENCES activities(id)
                ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_activity_elevation_user
            ON activity_elevations(user_id,activity_id)
        `)
}