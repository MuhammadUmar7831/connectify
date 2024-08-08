import axios from "../config/axios.config";

export const getMessageByChatIdApi = async (chatId: any, skip: number) => {
  try {
    const response = await axios.get(`/api/message/get?chatId=${chatId}&limit=${5}&skip=${skip}`);
    return response.data;
  } catch (error: any) {
    if (error.response) return error.response.data;
    else return { success: false, message: "Server is down" };
  }
};

export const sendMessageToChatApi = async (
  ChatId: number,
  Content: String,
  ReplyId: any
) => {
  try {
    const response = await axios.post(`/api/message/send`, {
      ChatId,
      Content,
      ReplyId,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) return error.response.data;
    else return { success: false, message: "Server is down" };
  }
};
