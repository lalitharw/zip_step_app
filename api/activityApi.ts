import api from "@/utils/api"

type createActivityInput = {
    client_id: string | null,
    started_at: string
}

export const createActivityOnServer = async (data: createActivityInput) => {
    try {
        const response = await api.post("/activities", data)

        if (response && response.data.data.activity) {
            return response.data.data.activity
        }

    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}