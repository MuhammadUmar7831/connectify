import { ChangeEvent, FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMessageByChatIdApi,
  sendMessageToChatApi,
} from "../api/message.api";
import axios from "axios";
import { useSelector } from "react-redux";

// Define the types for the message
interface Message {
  MessageId: number;
  ChatId: number;
  SenderId: number;
  Content: string;
  Timestamp: string;
  Sender: string;
  UserStatus: {
    Status: string;
    UserId: number;
    UserName: string;
  }[];
  ReplyId: number | null;
  ReplyContent: string | null;
  ReplySenderId: number | null;
  ReplySender: string | null;
}

export default function useChatArea() {
  const [Content, setContent] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useSelector((state: any) => state.user.user);

  const addDummyMessageObjectToMessageArray = async (Content: string) => {
    // Getting any message object of sender
    const messageFromSender = messages.find(
      (message) => message.SenderId === user.UserId
    );

    if (messageFromSender) {

      // Create a new message object
      const newMessage: Message = {
        ...messageFromSender,
        Content,
        MessageId:999999,
        Timestamp:'',
        UserStatus: [{ Status: 'sending' ,UserId: -1,
          UserName: ""}]
        // Add any other properties as needed
      };


      // Add the new message to the messages array
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        return updatedMessages;
      });

    }
  };

  // ** GET MESSAGE LOGIN STARTS HERE

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/message/get/${chatId}`);
      console.log("messages", response.data.data);
      setMessages(response.data.data); // Assuming response.data is of type Message[]
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
  const onSendMessageIconClick = async (event: FormEvent, chatId: any) => {
    try {
      event.preventDefault();
      // in order to clear the text field immediately, gives fast user experience
      const tempContent = Content;
      setContent("");

      // Showing dummy message on the frontend
      await addDummyMessageObjectToMessageArray(
        tempContent
      );
      const response = await sendMessageToChatApi(chatId, tempContent, false);
      // Setting the message Id of the inserted message
      setMessages(prevMessages => {
        return prevMessages.map(message => 
          message.MessageId === 999999 ? { ...message, MessageId:response.data.MessageId, Timestamp:response.data.Timestamp, UserStatus: [{ Status: 'sent' ,UserId: -1,
            UserName: ""}] } : message
        );
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
    onSendMessageIconClick,
    fetchMessages,
  };
}
