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
  ChatId: number | boolean, // false in case of new personal chat 
  Content: String,
  ReplyId: any,
  receiverId: number | null
) => {
  try {
    let body: any = {
      ChatId,
      Content,
      ReplyId
    }
    if (typeof receiverId === 'number' && ChatId === false) {
      body = {
        ChatId,
        Content,
        ReplyId,
        receiverId,
      }
    }

    const response = await axios.post(`/api/message/send`, body);
    return response.data;
  } catch (error: any) {
    if (error.response) return error.response.data;
    else return { success: false, message: "Server is down" };
  }
};

export const editMessageApi = async (ChatId: number, MessageId: number, Content: string) => {
  try {
    const response = await axios.put(`/api/message/edit`, {
      ChatId,
      MessageId,
      Content
    });
    return response.data;
  } catch (error: any) {
    if (error.response) return error.response.data;
    else return { success: false, message: "Server is down" };
  }
};
