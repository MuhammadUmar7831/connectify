import formatTimestamp from "../../utils/messageTimeFormater";

interface props {
    image: string;
    name: string;
    senderName?: string | null,
    lastMessage?: string | null;
    lastMessageTime?: string | null;
    notification?: number;
    isActive?: boolean
}

export default function ChatListItem({ image, name, senderName, lastMessage, lastMessageTime, notification, isActive }: props) {
    return (
        <>
            <div className="flex justify-between gap-2 p-4 text-gray-200 hover:bg-gray-100">
                <div className="flex gap-2 w-5/6">
                    <div className="relative h-12 w-14">
                        <img
                            alt="user"
                            src={image}
                            className="h-full w-full object-cover rounded-full"
                        />
                        {isActive && <span className="w-3 h-3 rounded-full bg-green-600 absolute right-0 bottom-0 border-2 border-white"></span>}
                    </div>
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
        </>
    )
}
