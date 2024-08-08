import { useEffect, useRef } from "react";
import MessageResponse from "../../types/MessageResponse.type";
import Message from "./Message";
import MessageReply from "./MessageReply";

interface ChatSectionProps {
  message: MessageResponse[];
  userId: number;
  onSetReplyClick: any;
}

export default function ChatSection({
  message,
  userId,
  onSetReplyClick,
}: ChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // smooth scrolling after message is sent
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [message]);

  function getMessage(messageId: number): MessageResponse | undefined {
    return message.find((mg) => mg.MessageId === messageId);
  }

  function formatTime(timestamp: string): string {
    if (timestamp === "") {
      // For dummy message
      return timestamp;
    }
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutesStr + " " + ampm;
    return strTime;
  }
  
  return (
    <div
      ref={chatContainerRef}
      className="bg-white rounded-2xl w-full h-full flex flex-col gap-10 p-4 overflow-y-scroll no-scrollbar"
    >
      {message.map((m) =>
        m.ReplyId === null ? (
          <Message
            key={m.MessageId}
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
            key={m.MessageId}
            onSetReplyClick={onSetReplyClick}
            me={m.SenderId === userId}
            message={getMessage(m.ReplyId)?.Content || ""}
            content={m.Content}
            time={`${formatTime(m.Timestamp)}`}
            senderId={m.SenderId}
            messageId={m.MessageId}
            senderName={m.Sender}
            userStatus={m.UserStatus}
          />
        )
      )}
    </div>
  );
}
