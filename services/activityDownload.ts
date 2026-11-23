import api from "@/utils/api";
import logger from "@/utils/logging/logger";

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

    logger.info("Get Server Activity Points", "", response.data)

    return response.data.points
}