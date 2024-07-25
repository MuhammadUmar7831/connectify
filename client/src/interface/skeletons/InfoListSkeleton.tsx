import Skeleton from "./Skeleton";

export const InfoListSkeleton = () => {
  return (
    <div className="flex justify-between mt-7">
      <div className="flex gap-2 w-full">
        <Skeleton className="rounded-full w-12 h-11 bg-gray-200 animate-pulse object-contain" />
        <div className="flex flex-col w-full">
          <Skeleton className="rounded-md w-16 h-5 animate-pulse mt-1" />
          <Skeleton className="rounded-md w-2/3 h-2 animate-pulse mt-2" />
        </div>
      </div>

      <div className="flex flex-col mr-2">
        <Skeleton className="w-1 h-1 rounded-full animate-pulse mt-4" />
        <Skeleton className="w-1 h-1 rounded-full animate-pulse mt-0.5" />
        <Skeleton className="w-1 h-1 rounded-full animate-pulse mt-0.5" />
      </div>
    </div>
  );
};
