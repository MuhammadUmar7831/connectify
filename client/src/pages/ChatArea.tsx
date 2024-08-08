import { useEffect } from "react";
import ChatHeader from "../components/ChatArea/ChatHeader";
import ChatSection from "../components/ChatArea/ChatSection";
import { useSelector } from "react-redux";
import SendMessageBox from "../components/ChatArea/SendMessageBox";
import useChatArea from "../hooks/useChatArea";
import { useParams } from "react-router-dom";

export default function ChatArea() {
  const { chatId } = useParams();
  const data = useSelector((state: any) => state.user);
  const notificationAudio = new Audio("/notification.m4a");

  // use ChatArea hook
  const {
    onContentChange,
    Content,
    onSendMessageIconClick,
    messages,
    chatHeaderData,
    fetchMessages,
    reply,
    onSetReplyClick,
  } = useChatArea();

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  return (
    <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2">
      <ChatHeader data={chatHeaderData} />
      <ChatSection
        onSetReplyClick={onSetReplyClick}
        messages={messages}
        userId={data.user.UserId}
        fetchMoreMessages={fetchMessages}
      />
      <SendMessageBox
        onSetReplyClick={onSetReplyClick}
        reply={reply}
        onContentChange={onContentChange}
        onSendMessageIconClick={onSendMessageIconClick}
        Content={Content}
      />
      {/* keep this because chrome does not allow audio autoplay unless user press any button */}
      <button className="hidden" id="notification" onClick={() => notificationAudio.play()}>
        Audio
      </button>
    </div>
  );
}
