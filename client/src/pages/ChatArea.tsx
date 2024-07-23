import { useState, useEffect } from "react";
import ChatHeader from "../components/ChatArea/ChatHeader";
import ChatSection from "../components/ChatArea/ChatSection";
import axios from "../config/axios.config";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // Import useParams

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

// Custom hook to fetch messages
const useFetchMessages = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/message/get/${chatId}`);
        setMessages(response.data.data); // Assuming response.data is of type Message[]
        console.log("messages",response.data.data)
      } catch (error: any) {
        console.error("Failed to fetch messages:", error); // Log error to console
      }
    };

    fetchMessages();
  }, [chatId]);

  return messages;
};

export default function ChatArea() {
  const data = useSelector((state: any) => state.user);
  const messages = useFetchMessages();
  const [receiverUserName, setReceiverUserName] = useState<string>("");

  useEffect(() => {
    if (messages&&messages.length > 0 && data?.user?.UserId) {
      const receiverData = messages.filter((message) => message.SenderId !== data.user.UserId);
      if (receiverData.length > 0) {
        setReceiverUserName(receiverData[0].Sender);
      }
    }
  }, [messages, data]);
  
  return (
    <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2">
      <ChatHeader userName={receiverUserName} />
      <ChatSection  message={messages} userId={data.user.UserId}/>
    </div>
  );
}
