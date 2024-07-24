import { useState, useEffect } from "react";
import ChatHeader from "../components/ChatArea/ChatHeader";
import ChatSection from "../components/ChatArea/ChatSection";
import { useSelector } from "react-redux";
import SendMessageBox from "../components/ChatArea/SendMessageBox";
import useChatArea from "../hooks/useChatArea";
import { useParams } from "react-router-dom";

export default function ChatArea() {
  const { chatId } = useParams();
  const data = useSelector((state: any) => state.user);
  const [receiverUserName, setReceiverUserName] = useState<string>("");


  // use ChatArea hook
  const {
    onContentChange,
    Content,
    onSendMessageIconClick,
    messages,
    fetchMessages,
  } = useChatArea();
 
  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (messages && messages.length > 0 && data?.user?.UserId) {
      const receiverData = messages.filter(
        (message) => message.SenderId !== data.user.UserId
      );
      if (receiverData.length > 0) {
        setReceiverUserName(receiverData[0].Sender);
      }
    }
  }, [messages, data]);

  return (
    <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2">
      <ChatHeader userName={receiverUserName} />
      <ChatSection message={messages} userId={data.user.UserId} />
      <SendMessageBox
        onContentChange={onContentChange}
        onSendMessageIconClick={onSendMessageIconClick}
        Content={Content}
      />
    </div>
  );
}
