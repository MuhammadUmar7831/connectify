import ChatListItem from "./ChatListItem";
import useChatList from "../../hooks/useChatList";
import ChatListSkeleton from "../../interface/skeletons/ChatListSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useSyncChatList from "../../hooks/useSyncChatList";
import getMessageStatus from "../../utils/getMessageStatus";

export default function ChatList() {

    const { user } = useSelector((state: RootState) => state.user)

    const {
        chatsToRender,
        pinnedChats,
        chatListType,
        isActive
    } = useChatList();

    useSyncChatList();

    if (chatsToRender === null) {
        return (
            <ChatListSkeleton />
        )
    }

    return (
        <div className="rounded-2xl w-full h-full bg-white overflow-y-scroll no-scrollbar">
            {chatListType !== 'Archived' && (
                <>
                    <h1 className="text-gray-200 mx-6 mt-6 uppercase text-sm">Pinned</h1>
                    {pinnedChats && pinnedChats.map((chat, index) => (
                        <ChatListItem
                            key={index}
                            userId={chat.UserId}
                            chatId={chat.ChatId}
                            image={chat.Avatar}
                            name={chat.Name}
                            senderIsMe={user !== null ? user.UserId === chat.SenderId : false}
                            senderName={chat.SenderName}
                            lastMessage={chat.Content}
                            lastMessageTime={chat.Timestamp}
                            notification={chat.unSeenMessages}
                            isActive={isActive(chat.UserId)}
                            status={getMessageStatus(chat.UserStatus)}
                        />
                    ))}
                </>
            )}

            <h1 className="text-gray-200 mx-6 mt-6 uppercase text-sm">{chatListType}</h1>
            {chatsToRender && chatsToRender.map((chat, index) => (
                <ChatListItem
                    key={index}
                    userId={chat.UserId}
                    chatId={chat.ChatId}
                    image={chat.Avatar}
                    name={chat.Name}
                    senderIsMe={user !== null ? user.UserId === chat.SenderId : false}
                    senderName={chat.SenderName}
                    lastMessage={chat.Content}
                    lastMessageTime={chat.Timestamp}
                    notification={chat.unSeenMessages}
                    isActive={isActive(chat.UserId)}
                    status={getMessageStatus(chat.UserStatus)}
                />
            ))}
        </div>
    );
}
