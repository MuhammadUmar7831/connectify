import Skeleton from "./Skeleton";

export default function ChatHeaderSkeleton() {
    return (
        <div className="bg-white rounded-2xl w-full p-4 h-[78px] flex justify-between items-center">
            <div className="flex gap-4 w-full items-center">
                <Skeleton className="w-14 aspect-square rounded-full" />
                <div className="w-full">
                    <Skeleton className="h-6 min-w-[100px] w-1/2 mb-2 rounded" />
                    <Skeleton className="h-4 min-w-[100px] w-1/4 rounded" />
                </div>
            </div>
            <div className="pr-2 w-[100px]">
                <Skeleton className="h-8 w-full rounded-3xl" />
            </div>
        </div>
    );
}
