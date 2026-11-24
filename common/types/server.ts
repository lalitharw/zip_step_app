export type ServerActivity = {
    id: number;
    user_id: number;
    client_id: string;
    status: string;
    start_time: string | null;
    end_time: string | null;
    distance: number;
    duration: number | null;
    average_speed: number | null;
    average_pace: number | null;
    elevation_gain: number | null;
    current_elevation: number | null;
    max_speed: number | null;
    map_image_path: string | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    pauses: pauses[] | null
};


export type pauses = {
    id: number;
    activity_id: number;
    client_id: string;
    pause_at: string;
    resume_at: string | null;
    user_id: number;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null
}

export interface LocationPoints {
    id: number;
    activity_id: number;
    client_id: string;
    latitude: number;
    longitude: number;
    speed: number;
    altitude: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: number;
    raw_latitude: string;
    raw_longitude: string;
    point_added: string;
    heading: string | null;
    accuracy: string | null
}