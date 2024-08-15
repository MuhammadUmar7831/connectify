import Skeleton from "./Skeleton";

export default function ChatListItemSekeleton() {
    return (
        <div className="p-4 flex gap-2">
            <Skeleton className="rounded-full p-6 bg-gray-200 animate-pulse" />
            <div className="flex gap-2 w-full">
                <div className="flex flex-col gap-4 w-full">
                    <Skeleton className="bg-gray-200 w-32 h-4 rounded-md animate-pulse" />
                    <Skeleton className="bg-gray-200 w-52 h-2 rounded-md animate-pulse" />
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <Skeleton className="bg-gray-200 rounded-md animate-pulse w-10 h-4" />
                    <Skeleton className="bg-gray-200 rounded-full animate-pulse w-6 h-6" />
                </div>
            </div>
        </div>
    )
}
