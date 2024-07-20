import { Link } from "react-router-dom";
import formatTimestamp from "../../utils/messageTimeFormater";
import Avatar from "../../interface/Avatar";

interface props {
    chatId: number;
    image: string;
    name: string;
    senderName?: string | null,
    lastMessage?: string | null;
    lastMessageTime?: string | null;
    notification?: number;
    isActive?: boolean
}

export default function ChatListItem({ chatId, image, name, senderName, lastMessage, lastMessageTime, notification, isActive }: props) {
    return (
        <Link to={`/c/${chatId}`}>
            <div className="flex justify-between gap-2 p-4 text-gray-200 hover:bg-gray-100">
                <div className="flex gap-2 w-5/6">
                    <Avatar image={image} isActive={isActive} />
                    <div className="flex flex-col gap-2 w-full text-nowrap overflow-hidden">
                        <h1 className="text-black font-semibold overflow-hidden text-ellipsis">{name}</h1>
                        <p className="text-sm overflow-hidden text-ellipsis">{senderName ? <>{senderName}: </> : <></>}{lastMessage}</p>
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
