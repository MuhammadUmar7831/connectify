import axios from "../config/axios.config";

export const signinApi = async (body: { email: string, password: string }) => {
    try {
        const response = await axios.post(`/api/auth/signin`, body);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: 'Server is Down' }
        }
    }
}

export const signupApi = async (body: { email: string; password: string; name: string; avatar: string; bio: string }) => {
    try {
      console.log("Sending signup request with body:", body); // Debug log
  
      const response = await axios.post("/api/auth/signup", body);
  
      console.log("User Signed Up:", response.data); // Debug log
  
      return response.data;
    } catch (error: any) {
      console.error("Signup error:", error); // Debug log
  
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, message: "Server is Down" };
      }
    }
  };