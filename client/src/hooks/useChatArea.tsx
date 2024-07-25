import { ChangeEvent, FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMessageByChatIdApi,
  sendMessageToChatApi,
} from "../api/message.api";
import { useDispatch, useSelector } from "react-redux";
import MessageResponse from "../types/MessageResponse.type";
import { setError } from "../redux/slices/error";

// Define the types for the message

export default function useChatArea() {
  const [Content, setContent] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const addDummyMessageObjectToMessageArray = async (Content: string) => {
    // Getting any message object of sender
    const messageFromSender = messages.find(
      (message) => message.SenderId === user.UserId
    );

    if (messageFromSender) {
      // Create a new message object
      const newMessage: MessageResponse = {
        ...messageFromSender,
        Content,
        MessageId: 999999,
        Timestamp: "",
        UserStatus: [{ Status: "sending", UserId: -1, UserName: "" }],
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
    try {
      // const response = await axios.get(`/api/message/get/${chatId}`);
      const response = await getMessageByChatIdApi(chatId);
      setMessages(response.data); // Assuming response.data is of type Message[]
    } catch (error: any) {
      console.error("Failed to fetch messages:", error); // Log error to console
    }
  };
  // GET MESSAGE LOGIC ENDS HERE **

  // ** SEND MESSAGE LOGIC STARTS HERE

  // Handling change of content when message is typed
  const onContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  // handle send message button click
  const onSendMessageIconClick = async (chatId: any) => {
    try {
      // in order to clear the text field immediately, gives fast user experience
      const tempContent = Content;
      setContent("");

      // Showing dummy message on the frontend
      await addDummyMessageObjectToMessageArray(tempContent);
      const response = await sendMessageToChatApi(chatId, tempContent, false);

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
    onSendMessageIconClick,
    fetchMessages,
  };
}
