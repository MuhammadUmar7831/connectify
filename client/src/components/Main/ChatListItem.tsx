import { Link } from "react-router-dom";
import formatTimestamp from "../../utils/messageTimeFormater";
import Avatar from "../../interface/Avatar";
import SingleTick from "../../interface/SingleTick";
import DoubleTick from "../../interface/DoubleTick";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getSocket } from "../../config/scoket.config";

// userId will be null in case of group chat
// if chat is group chat (i.e. userId is null) than there is chance that the chat has no last message 
interface props {
    userId: number | null;
    chatId: number;
    image: string;
    name: string;
    senderIsMe: boolean;
    senderName: string | null,
    lastMessage: string | null;
    lastMessageTime: string | null;
    notification: number;
    isActive: boolean;
    status: string | null
}

export default function ChatListItem({ userId, chatId, image, name, senderIsMe, senderName, lastMessage, lastMessageTime, notification, isActive, status }: props) {
    const _content =
        lastMessage ?
            userId === null ? // mean this is group chat
                senderIsMe ?
                    `You: ${lastMessage}` // sender is me
                    : `${senderName}: ${lastMessage}`  // // sender is not me
                : lastMessage // not group so not senderName
            : ''; // there is no last message for this chat
    const [content, setContent] = useState<string>(_content)



    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const socket = getSocket();

    const handleUserTyping = (userId: number, userName: string, _chatId: string) => {
        if (user?.UserId != userId && chatId === parseInt(_chatId)) {
            // if (data?.Type === 'Personal') {
            setIsTyping(true);
            setContent(`${userName} is Typing...`);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            const timeout = window.setTimeout(() => {
                setIsTyping(false);
                setContent(_content);
                setTypingTimeout(null); // Reset timeout state
            }, 1000);

            setTypingTimeout(timeout);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('userTyping', handleUserTyping);

            return () => {
                socket.off('userTyping');
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }
            };
        }
    }, [socket, typingTimeout]);

    useEffect(() => {
        if (!isTyping) {
            setContent(_content);
        }
    }, [_content, isTyping]);

    return (
        <Link to={`/chat/${chatId}`}>
            <div className="flex justify-between gap-2 p-4 text-gray-200 hover:bg-gray-100">
                <div className="flex gap-2 w-5/6">
                    <Avatar image={image} isActive={isActive} />
                    <div className="flex flex-col gap-2 w-full text-nowrap overflow-hidden">
                        <h1 className="text-black font-semibold overflow-hidden text-ellipsis">{name}</h1>
                        <p className="text-sm overflow-hidden flex items-center gap-1">
                            {senderIsMe && (status === "sent" ? (
                                <SingleTick size="16" className="text-gray-200" />
                            ) : status === "received" ? (
                                <DoubleTick size="16" className="text-gray-200" />
                            ) : status === "seen" ? (
                                <DoubleTick size="16" className="text-orange" />
                            ) : <></>)
                            }
                            <span className={isTyping ? 'text-orange' : ''}>{content?.substring(0, 30)}</span>
                            {content && content.length > 30 && <>...</>}
                        </p>
                    </div>
                </div>
                <div className="text-sm flex flex-col items-end justify-between gap-1 text-nowrap">
                    <span className="text-xs">{formatTimestamp(lastMessageTime)}</span>
                    {notification ? <span className="bg-orange rounded-full text-xs text-white w-5 h-5 flex items-center justify-center">{notification}</span> : <></>}
                </div>
            </div>
            <div className="h-[1px] bg-gray-100 mx-auto w-5/6 my-[-1px]" />
        </Link >
    )
}
