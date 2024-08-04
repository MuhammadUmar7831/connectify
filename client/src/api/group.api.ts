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

export const kickUserApi = async (body: { toBeKickedId: number, groupId: number }) => {
    try {
        const response = await axios.delete(`/api/group/kick`, {
            data: body,
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' };
        }
    }
};

export const makeAdminApi = async (body: { friendId: number, groupId: number }) => {
    try {
        const response = await axios.post(`/api/group/add/admin`, body);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' };
        }
    }
};
