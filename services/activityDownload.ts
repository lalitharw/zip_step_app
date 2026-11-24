import api from "@/utils/api";

export async function getServerActivities(page: number = 1) {
    const response = await api.get(`sync/activities?page=${page}`)
    return response.data;
}

export async function getServerActivityPoints(activitydId: number, cursor?: string) {
    const response = await api.get(`sync/activities/${activitydId}/points`, {
        params: {
            cursor
        }
    })
    return response.data.data
}

