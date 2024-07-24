import { ChangeEvent, FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessageByChatIdApi, sendMessageToChatApi } from "../api/message.api";
import axios from "axios";

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
  // GET MESSAGE LOGIN ENDS HERE **

  // ** SEND MESSAGE LOGIN STARTS HERE

    // Handling change of content when message is typed
    const onContentChange = (e:ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };

    // handle send message button click
    const onSendMessageIconClick = async (event:FormEvent, chatId:any)=>{  
        try {
        event.preventDefault();
        // in order to clear the text field immediately, gives fast user experience
        const tempContent = Content;
        setContent("");
        const response = await sendMessageToChatApi(chatId, tempContent, false);
        const get = await axios.get(`/api/message/get/${chatId}`);
        setMessages(get.data.data);
        
        
        } catch (error: any) {
        console.error("Failed to fetch messages:", error); // Log error to console
        }
    }
    
  // SEND MESSAGE LOGIN ENDS HERE **

   
     
  return { onContentChange, Content, setContent, setMessages, messages, onSendMessageIconClick, fetchMessages };
};
