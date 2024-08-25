import ChatHeader from "../components/ChatArea/ChatHeader";
import ChatSection from "../components/ChatArea/ChatSection";
import { useSelector } from "react-redux";
import SendMessageBox from "../components/ChatArea/SendMessageBox";
import useChatArea from "../hooks/useChatArea";
import MessageInfoPanel from "../components/ChatArea/MessageInfoPanel";
import { MessageInfoProvider } from "../context/MessageInfoContext";
import ChatHeaderSkeleton from "../interface/skeletons/ChatHeaderSkeleton";
import ChatSectionSkeleton from "../interface/skeletons/ChatSectionSkeleton";
import SendMessageBoxSkeleton from "../interface/skeletons/SendMessageBoxSkeleton";

export default function ChatArea() {
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
    editMessage
  } = useChatArea();

  if (chatHeaderData === null || messages === null) {
    return (
      <div className="w-full h-full flex flex-col gap-2">
        <ChatHeaderSkeleton />
        <ChatSectionSkeleton />
        <SendMessageBoxSkeleton />
      </div>
    )
  }

  return (
    <MessageInfoProvider>
      <div className="w-full h-full flex flex-col gap-2 relative overflow-hidden">
        <ChatHeader data={chatHeaderData} />
        <ChatSection
          onSetReplyClick={onSetReplyClick}
          messages={messages}
          userId={data.user.UserId}
          fetchMoreMessages={fetchMessages}
          editMessage={editMessage}
        />
        <SendMessageBox
          onSetReplyClick={onSetReplyClick}
          reply={reply}
          onContentChange={onContentChange}
          onSendMessageIconClick={onSendMessageIconClick}
          Content={Content}
        />
        <MessageInfoPanel />
        {/* keep this because chrome does not allow audio autoplay unless user press any button */}
        <button className="hidden" id="notification" onClick={() => notificationAudio.play()}>
          Audio
        </button>
      </div>
    </MessageInfoProvider>
  );
}
