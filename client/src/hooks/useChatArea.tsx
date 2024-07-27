import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMessageByChatIdApi,
  sendMessageToChatApi,
} from "../api/message.api";
import { useDispatch, useSelector } from "react-redux";
import MessageResponse from "../types/MessageResponse.type";
import { setError } from "../redux/slices/error";
import { getSocket } from "../config/scoket.config";
import ChatHeaderResponse from "../types/chatHeaderReponse.type";
import { RootState } from "../redux/store";
import Reply from "../types/reply.type";

// Define the types for the message

export default function useChatArea() {
  const [Content, setContent] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [chatHeaderData, setChatHeaderData] =
    useState<ChatHeaderResponse | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [reply, setReply] = useState<Reply>({
    ReplyId: null,
    ReplyContent: null,
    ReplySenderId: null,
    ReplySender: null,
  });

  // update reply state on click
  const onSetReplyClick = (
    ReplyId: number,
    ReplyContent: string,
    ReplySenderId: number,
    ReplySender: string
  ) => {
    setReply({ ReplyId, ReplyContent, ReplySenderId, ReplySender });
  };

  const addDummyMessageObjectToMessageArray = async (
    Content: string,
    reply: Reply
  ) => {
    // Getting any message object of sender
    const messageFromSender = messages.find(
      (message) => message.SenderId === user?.UserId
    );

    if (messageFromSender) {
      // Create a new message object
      const newMessage: MessageResponse = {
        ...messageFromSender,
        Content,
        MessageId: 999999,
        Timestamp: "",
        UserStatus: [{ Status: "sending", UserId: -1, UserName: "" }],
        ReplyId: reply.ReplyId,
        ReplyContent: reply.ReplyContent,
        ReplySenderId: reply.ReplySenderId,
        ReplySender: reply.ReplySender,
        // Add any other properties as needed
      };

      // Add the new message to the messages array
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        return updatedMessages;
      });
    }
  };

  // ** GET MESSAGE LOGIC STARTS HERE

  const fetchMessages = async () => {
    const res = await getMessageByChatIdApi(chatId);
    if (res.success) {
      setChatHeaderData(res.chatHeaderData);
      setMessages(res.data);
    } else {
      dispatch(setError(res.message));
    }
  };
  // GET MESSAGE LOGIC ENDS HERE **

  // ** SEND MESSAGE LOGIC STARTS HERE

  // Handling change of content when message is typed
  const onContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("startTyping", chatId, user?.Name);
    }
    setContent(e.target.value);
  };

  // handle send message button click
  const onSendMessageIconClick = async (chatId: any) => {
    try {
      // in order to clear the text field immediately, gives fast user experience
      const tempContent = Content;
      const tempReply: Reply = reply;
      setContent("");
      setReply({
        ReplyId: null,
        ReplyContent: null,
        ReplySenderId: null,
        ReplySender: null,
      });

      // Showing dummy message on the frontend
      await addDummyMessageObjectToMessageArray(tempContent, tempReply);
      const response = await sendMessageToChatApi(
        chatId,
        tempContent,
        tempReply.ReplyId
      );

      if (response.success) {
        // Setting the message Id of the inserted message
        setMessages((prevMessages) => {
          return prevMessages.map((message) =>
            message.MessageId === 999999
              ? {
                  ...message,
                  MessageId: response.data.MessageId,
                  Timestamp: response.data.Timestamp,
                  UserStatus: [{ Status: "sent", UserId: -1, UserName: "" }],
                }
              : message
          );
        });
      } else {
        // Showing that message was not sent and error occurred
        setMessages((prevMessages) => {
          return prevMessages.map((message) =>
            message.MessageId === 999999
              ? {
                  ...message,
                  UserStatus: [{ Status: "error", UserId: -1, UserName: "" }],
                }
              : message
          );
        });
        dispatch(setError(response.message));
      }

      // setting the reply state to null after message sent
      setReply({
        ReplyId: null,
        ReplyContent: null,
        ReplySenderId: null,
        ReplySender: null,
      });
    } catch (error: any) {
      console.error("Failed to fetch messages:", error); // Log error to console
    }
  };

  // SEND MESSAGE LOGIN ENDS HERE **

  return {
    onContentChange,
    Content,
    setContent,
    setMessages,
    messages,
    chatHeaderData,
    onSendMessageIconClick,
    fetchMessages,
    reply,
    onSetReplyClick,
  };
}
