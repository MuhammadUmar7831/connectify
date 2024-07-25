import { useEffect } from "react";
import MessageResponse from "../../types/MessageResponse.type";
import Message from "./Message";
import MessageReply from "./MessageReply";

interface ChatSectionProps {
  message: MessageResponse[];
  userId: number;
}


export default function ChatSection({ message, userId }: ChatSectionProps) {

  useEffect(()=>{
    console.log("i wun  ow")
  },[message])

  function getMessage(messageId: number): MessageResponse | undefined {
    return message.find(mg => mg.MessageId === messageId);
  }

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutesStr + ' ' + ampm;
    return strTime;
  }
  const sortedMessages = [...message].sort((a, b) => a.MessageId - b.MessageId);
  return (
    <div className="bg-white rounded-2xl w-full h-full flex flex-col gap-10 p-4 overflow-y-scroll no-scrollbar">
      {
        sortedMessages.map((m) => (
          m.ReplyId === null ?
            <Message me={m.SenderId === userId} content={m.Content} time={`${formatTime(m.Timestamp)}`} status={m.UserStatus[0].Status} senderName={m.Sender} />
            :
            <MessageReply me={m.SenderId === userId} message={getMessage(m.ReplyId)?.Content || ''} content={m.Content} time={`${formatTime(m.Timestamp)}`} status={m.UserStatus[0].Status} senderName={m.Sender} />
        ))
      }


    </div>
  )
}
