import { useCallback, useEffect, useRef, useState } from "react";
import MessageResponse from "../../types/MessageResponse.type";
import Message from "./Message";
import MessageReply from "./MessageReply";
import { ClipLoader } from "react-spinners";
import { motion } from 'framer-motion';
import themeColor from "../../config/theme.config";

interface ChatSectionProps {
  messages: MessageResponse[];
  userId: number;
  onSetReplyClick: any;
  fetchMoreMessages: () => Promise<boolean>;
}

const floatingDateBadgeVariants = {
  bounce: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

export default function ChatSection({ messages, userId, onSetReplyClick, fetchMoreMessages, }: ChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastVisibleDate, setLastVisibleDate] = useState<string | null>(null);

  const handleScroll = async () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      // if (container.scrollTop === 0) {
      //   console.log('Set the Scroll to Down Button to Hide')
      // }
      const tolerance = 1;
      const scrollDiff = Math.abs(container.scrollHeight - container.clientHeight + container.scrollTop);

      if (!reachedEnd && !loading && scrollDiff <= tolerance) {
        setLoading(true)
        const isEnd = await fetchMoreMessages(); // return true if we reached the end
        setLoading(false);
        if (isEnd) {
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

  function formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, yesterday)) {
      return "Yesterday";
    } else if (date.getFullYear() === today.getFullYear()) {
      const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } else {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const messageDate = entry.target.getAttribute("data-timestamp");
        if (messageDate) {
          setLastVisibleDate(formatDate(new Date(messageDate)));
        }
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: chatContainerRef.current,
      threshold: 0.5, // 50% of the message should be visible
    });

    const messageElements = chatContainerRef.current?.querySelectorAll(".message") || [];

    messageElements.forEach((messageElement) => observer.observe(messageElement));

    return () => {
      messageElements.forEach((messageElement) => observer.unobserve(messageElement));
    };
  }, [messages, observerCallback]);

  useEffect(() => { setReachedEnd(false) }, [])

  let lastDate = messages.length > 0 ? new Date(messages[0].Timestamp) : new Date();

  return (
    <div className="relative bg-white overflow-hidden rounded-2xl w-full h-full">
      {messages.length > 0 &&
        // condition to check if the chatContainer is overflowing if not than don't show the floating bage
        (chatContainerRef.current?.scrollHeight || 0) > (chatContainerRef.current?.clientHeight || 0)
        &&
        <motion.div
          key={lastVisibleDate}
          variants={floatingDateBadgeVariants}
          animate="bounce"
          className="sticky top-6 flex justify-center my-2 z-10">
          <span className="bg-gray text-black text-xs py-1 px-3 rounded-md shadow-lg">
            {lastVisibleDate}
          </span>
        </motion.div>
      }
      <div
        ref={chatContainerRef}
        className="absolute inset-0 flex flex-col-reverse gap-10 p-4 overflow-y-scroll no-scrollbar"
      >
        {messages.map((m) => {
          const badgeDate = lastDate;
          const currentDate = new Date(m.Timestamp);
          const isSameAsLastDate = currentDate.toLocaleDateString() === lastDate.toLocaleDateString();
          if (!isSameAsLastDate) {
            lastDate = currentDate;
          }

          return (
            <div className="message" data-timestamp={m.Timestamp}>
              {!isSameAsLastDate &&
                <div className="flex justify-center my-2">
                  <span className="bg-gray text-black text-xs py-1 px-3 rounded-md shadow-lg">
                    {formatDate(badgeDate)}
                  </span>
                </div>
              }
              {m.ReplyId === null ? (
                <Message
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
              )}
            </div>
          );
        })}
        {loading &&
          <span className="flex justify-center z-10">
            <ClipLoader size={20} color={themeColor} />
          </span>
        }
      </div>
    </div>
  );

}
