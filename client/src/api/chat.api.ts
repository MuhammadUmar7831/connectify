import axios from "../config/axios.config";

export const getGroupChatsApi = async () => {
    try {
        const response = await axios.get(`/api/chat/get/group`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}

export const getPersonalChatsApi = async () => {
    try {
        const response = await axios.get(`/api/chat/get/personal`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}

export const getPinnedChatsApi = async () => {
    try {
        const response = await axios.get(`/api/chat/get/pinned`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}

export const getArchiveChatsApi = async () => {
    try {
        const response = await axios.get(`/api/chat/get/archive`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}