import { Link } from "react-router-dom";
import formatTimestamp from "../../utils/messageTimeFormater";
import Avatar from "../../interface/Avatar";
import SingleTick from "../../interface/SingleTick";
import DoubleTick from "../../interface/DoubleTick";

interface props {
    chatId: number;
    image: string;
    name: string;
    senderName?: string | null,
    lastMessage?: string | null;
    lastMessageTime?: string | null;
    notification?: number;
    isActive?: boolean;
    status: string | null
}

export default function ChatListItem({ chatId, image, name, senderName, lastMessage, lastMessageTime, notification, isActive, status }: props) {
    return (
        <Link to={`/chat/${chatId}`}>
            <div className="flex justify-between gap-2 p-4 text-gray-200 hover:bg-gray-100">
                <div className="flex gap-2 w-5/6">
                    <Avatar image={image} isActive={isActive} />
                    <div className="flex flex-col gap-2 w-full text-nowrap overflow-hidden">
                        <h1 className="text-black font-semibold overflow-hidden text-ellipsis">{name}</h1>
                        <p className="text-sm overflow-hidden flex items-center gap-1">
                            {status === "sent" ? (
                                <SingleTick size="16" className="text-gray-200" />
                            ) : status === "received" ? (
                                <DoubleTick size="16" className="text-gray-200" />
                            ) : status === "received" ? (
                                <DoubleTick size="16" className="text-orange" />
                            ) : <></>
                            }
                            {senderName ? <>{senderName}: </> : <></>}{lastMessage?.substring(0, 30)}
                            {lastMessage && lastMessage.length > 30 && <>...</>}
                        </p>
                    </div>
                </div>
                <div className="text-sm flex flex-col items-end justify-between gap-1 text-nowrap">
                    <span className="text-xs">{formatTimestamp(lastMessageTime)}</span>
                    {notification ? <span className="bg-orange rounded-full text-xs text-white w-5 h-5 flex items-center justify-center">{notification}</span> : <></>}
                </div>
            </div>
            <div className="h-[1px] bg-gray-100 mx-auto w-5/6 my-[-1px]" />
        </Link>
    )
}
