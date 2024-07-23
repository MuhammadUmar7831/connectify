import axios from "../config/axios.config";
// import { useParams } from "react-router-dom";

export const getMessageByChatIdApi = async (chatId: number) => {
  // const { chatId } = useParams<{ chatId: string }>();
  // console.log("ChatId in messageAIP", chatId);
  try {
    const response = await axios.get(`/api/message/get/${chatId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) return error.response.data;
    else return { success: false, message: "Server is down" };
  }
};
