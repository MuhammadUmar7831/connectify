import axios from "../config/axios.config";

export const getUserApi = async () => {
    try {
        const response = await axios.get(`/api/user/get`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}

export const getFriendInfoApi = async (friendId: number) => {
    try {
        const response = await axios.get(`/api/user/get/info/${friendId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}