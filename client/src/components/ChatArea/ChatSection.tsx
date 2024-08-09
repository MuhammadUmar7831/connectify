import { useEffect, useRef, useState } from "react";
import MessageResponse from "../../types/MessageResponse.type";
import Message from "./Message";
import MessageReply from "./MessageReply";
import { ClipLoader } from "react-spinners";
import themeColor from "../../config/theme.config";

interface ChatSectionProps {
  messages: MessageResponse[];
  userId: number;
  onSetReplyClick: any;
  fetchMoreMessages: () => Promise<boolean>;
}

export default function ChatSection({ messages, userId, onSetReplyClick, fetchMoreMessages, }: ChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleScroll = async () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;

      if (!reachedEnd && !loading && (container.scrollHeight + container.scrollTop === container.clientHeight)) {
        setLoading(true)
        const isEnd = await fetchMoreMessages(); // return true if we reached the end
        setLoading(false);
        if (isEnd) {
          console.log('first')
          setReachedEnd(true);
        }
      }
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [messages, reachedEnd, loading]);  // Depend on messages to track updates

  function formatTime(timestamp: string): string {
    if (timestamp === "") {
      return timestamp;
    }
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutesStr + " " + ampm;
    return strTime;
  }

  return (
    <>
      <div
        ref={chatContainerRef}
        className="bg-white rounded-2xl w-full h-full flex flex-col-reverse gap-10 p-4 overflow-y-scroll no-scrollbar"
      >
        {messages.map((m, i) =>
          m.ReplyId === null ? (
            <Message
              key={i}
              onSetReplyClick={onSetReplyClick}
              me={m.SenderId === userId}
              content={m.Content}
              time={`${formatTime(m.Timestamp)}`}
              senderName={m.Sender}
              senderId={m.SenderId}
              messageId={m.MessageId}
              userStatus={m.UserStatus}
            />
          ) : (
            <MessageReply
              key={i}
              onSetReplyClick={onSetReplyClick}
              me={m.SenderId === userId}
              message={m.ReplyContent ? m.ReplyContent : 'That is not Possible'}
              content={m.Content}
              time={`${formatTime(m.Timestamp)}`}
              senderId={m.SenderId}
              senderName={m.Sender}
              replySenderId={m.ReplySenderId}
              replySender={m.ReplySender}
              messageId={m.MessageId}
              userStatus={m.UserStatus}
            />
          )
        )}
        {loading &&
          <span className="flex justify-center">
            <ClipLoader size={20} color={themeColor} />
          </span>
        }
      </div>
    </>
  );
}
