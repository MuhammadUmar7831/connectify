import Skeleton from "./Skeleton";
import { InfoListSkeleton } from "./InfoListSkeleton";

export const InfoSkeleton = () => {
  return (
    <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
            <div className="bg-white rounded-2xl p-4">
                <div className="rounded-full overflow-hidden mx-auto w-44 h-44">
                    <Skeleton className="size-44 rounded-full animate-pulse"/>
                </div>
                <div className="flex flex-col gap-1 items-center w-full mt-5">
                    <Skeleton className="w-40 h-6 rounded-md animate-pulse"/>
                    <Skeleton className="w-32 h-4 rounded-md animate-pulse mt-2"/>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-4">
                <Skeleton className="w-20 h-5 mt-3 rounded-md animate-pulse"/>
                <Skeleton className="w-1/3 h-2 mt-4 rounded-md animate-pulse"/>
                <Skeleton className="w-20 h-5 mt-5 rounded-md animate-pulse"/>
                <Skeleton className="w-2/3 h-2 mt-4 rounded-md animate-pulse"/>
            </div>
            <div className="bg-white rounded-2xl p-4">
                <Skeleton className="w-20 h-5 rounded-md animate-pulse mt-2"/>
                <InfoListSkeleton/>
                <InfoListSkeleton/>
                <InfoListSkeleton/>
            </div>
        </div>
  )
}
