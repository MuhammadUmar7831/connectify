import Skeleton from "./Skeleton";

export const InfoListSkeleton = () => {
  return (
    <div className="flex justify-start mt-8">
      <div className="rounded-full w-11 h-11 overflow-hidden">
        <Skeleton className="rounded-full w-14 h-12 bg-gray-200 animate-pulse" />
      </div>
      <div className="flex flex-col items-center ml-2 mr-96">
        <Skeleton className="rounded-md w-16 h-5 animate-pulse mt-1"/>
        <Skeleton className="rounded-md w-16 h-3 animate-pulse mt-2"/>
      </div>
      <div className="ml-96">
        <Skeleton className="w-3 h-7 rounded-xl animate-pulse"/>
      </div>
    </div>
  );
};
