import ChatListItem from "./ChatListItem";
import useChatList from "../../hooks/useChatList";
import ChatListSkeleton from "../../interface/skeletons/ChatListSkeleton";

export default function ChatList() {

    const {
        chatsToRender,
        pinnedChats,
        chatListType,
        isActive
    } = useChatList();

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
                            chatId={chat.ChatId}
                            image={chat.Avatar}
                            name={chat.Name}
                            lastMessage={chat.Content}
                            lastMessageTime={chat.TimeStamp}
                            notification={chat.unSeenMessages}
                            isActive={isActive(chat.UserId)}
                            status={chat.Status}
                        />
                    ))}
                </>
            )}

            <h1 className="text-gray-200 mx-6 mt-6 uppercase text-sm">{chatListType}</h1>
            {chatsToRender && chatsToRender.map((chat, index) => (
                <ChatListItem
                    key={index}
                    chatId={chat.ChatId}
                    image={chat.Avatar}
                    name={chat.Name}
                    senderName={chat.SenderName}
                    lastMessage={chat.Content}
                    lastMessageTime={chat.TimeStamp}
                    notification={chat.unSeenMessages}
                    isActive={isActive(chat.UserId)}
                    status={chat.Status}
                />
            ))}
        </div>
    );
}
