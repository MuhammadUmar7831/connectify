import axios from "../config/axios.config";

export const getUserApi = async (userId?: number) => {
    try {
        let url = "/api/user/get";
        if (userId) {
            url = `/api/user/get?userId=${userId}`
        }

        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}


export const updateUserApi = async (body: { UserId: number, Name: string, Avatar: string, Bio: string }) => {
    try {
        const response = await axios.put(`/api/user/update`, body);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' };
        }
    }
};


export const getFriendInfoApi = async (friendId: number, myId: number) => {
    try {
        const response = await axios.get(`/api/user/get/info?friendId=${friendId}&myId=${myId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}

export const searchApi = async (body: { query: string, notInclude: number[] }) => {
    try {
        const response = await axios.post(`/api/user/search`, body);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}