import api from "./api";

export const getActivities = async () => {
    const response = await api.get("/activities");
    return response.data;
};

export const getRecentActivities = async () => {
    const response = await api.get("/activities/recent");
    return response.data;
};

export const getActivityCount = async () => {
    const response = await api.get("/activities/count");
    return response.data;
};