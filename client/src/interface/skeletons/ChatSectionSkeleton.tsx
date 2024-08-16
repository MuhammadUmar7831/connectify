import Skeleton from "./Skeleton";

export default function ChatSectionSkeleton() {
    return (
        <div className="w-full h-full overflow-y-scroll no-scrollbar bg-white rounded-2xl p-4 flex flex-col-reverse gap-5">
            <div className="flex justify-end w-full">
                <Skeleton className="h-20 w-40 rounded-l-2xl rounded-tr-2xl p-4" />
            </div>
            <div className="flex justify-end w-full">
                <Skeleton className="h-10 w-40 rounded-l-2xl rounded-tr-2xl" />
            </div>
            <div className="flex w-full">
                <Skeleton className="h-10 w-40 rounded-r-2xl rounded-tl-2xl" />
            </div>
            <div className="flex justify-end w-full">
                <Skeleton className="h-10 w-40 rounded-l-2xl rounded-tr-2xl" />
            </div>
            <div className="flex w-full">
                <Skeleton className="h-10 w-40 rounded-r-2xl rounded-tl-2xl" />
            </div>
        </div>
    )
}
