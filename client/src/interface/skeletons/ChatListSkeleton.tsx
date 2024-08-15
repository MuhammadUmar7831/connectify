import ChatListItemSekeleton from "./ChatListItemSekeleton";
import Skeleton from "./Skeleton";

export default function ChatListSkeleton() {
    return (
        <div className="w-full h-full">
            <Skeleton className="bg-gray-200 mx-6 mt-6 w-32 h-6 rounded-md animate-pulse" />
            <ChatListItemSekeleton />
            <ChatListItemSekeleton />
            <Skeleton className="bg-gray-200 mx-6 mt-6 w-32 h-6 rounded-md animate-pulse" />
            <ChatListItemSekeleton />
            <ChatListItemSekeleton />
        </div>
    )
}
