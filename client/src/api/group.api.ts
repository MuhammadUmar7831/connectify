import axios from "../config/axios.config";

export const getCommonGroupsApi = async (friendId: number) => {
    try {
        const response = await axios.get(`/api/group/get/common/${friendId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}

export const getGroupInfoApi = async (groupId: number) => {
    try {
        const response = await axios.get(`/api/group/get/info/${groupId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}