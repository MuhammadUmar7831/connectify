import axios from "../config/axios.config";

export const signinApi = async (body: { email: string, password: string }) => {
    try {
        const response = await axios.post(`/api/auth/signin`, body);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: true, message: 'Server is Down' }
        }
    }
}