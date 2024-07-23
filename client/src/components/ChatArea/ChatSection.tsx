import Message from "./Message";
import MessageReply from "./MessageReply";
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

interface ChatSectionProps {
  message: Message[];
  userId:string;
}


export default function ChatSection({message,userId}:ChatSectionProps) {

   function getMessage(messageId:number):Message|undefined{
  return  message.find(mg => mg.MessageId === messageId);
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
            sortedMessages.map((m)=>(
              m.ReplyId === null ? 
             <Message me={m.SenderId===userId? true:false} content={m.Content} time={`${formatTime(m.Timestamp)}`} status={m.UserStatus[0].Status} senderName={m.Sender} />
             :
             <MessageReply me={m.SenderId===userId? true:false} message={getMessage(m.ReplyId)?.Content || ''}  content={m.Content} time={`${formatTime(m.Timestamp)}`} status={m.UserStatus[0].Status} senderName={m.Sender} />
            ))
          }  
          
           
        </div>
    )
}
