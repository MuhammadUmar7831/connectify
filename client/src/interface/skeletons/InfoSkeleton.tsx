import Skeleton from "./Skeleton";

export default function InfoSkeleton() {
    return (
        <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar" >
            <div className="bg-white rounded-2xl p-4">
                <div className="flex justify-end">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                    </div>
                </div>
                <Skeleton className="rounded-full mx-auto w-44 h-44" />
                <div className="flex flex-col gap-2 items-center w-full mt-3">
                    <Skeleton className="w-[300px] max-w-full h-7 rounded-md" />
                    <Skeleton className="w-[250px] max-w-full h-4 rounded-md" />
                </div>
                <div className="flex justify-center mt-5 gap-2">
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <Skeleton className="w-16 h-16 rounded-md" />
                </div>
                <Skeleton className="w-[100px] max-w-full h-4 rounded-md mx-auto mt-5" />
            </div>
            <div className="w-full bg-white rounded-2xl flex flex-col gap-5 p-4">
                <div className="w-full flex flex-col gap-2 justify-center">
                    <Skeleton className="w-[100px] h-4 rounded-md" />
                    <Skeleton className="w-1/3 min-w-[100px] h-6 rounded-md" />
                </div>
                <div className="w-full flex flex-col gap-2 justify-center">
                    <Skeleton className="w-[100px] h-4 rounded-md" />
                    <Skeleton className="w-1/2 min-w-[100px] h-6 rounded-md" />
                </div>
            </div>
            <div className="w-full bg-white rounded-2xl flex flex-col gap-5 p-4">
                <Skeleton className="w-[100px] max-w-full h-6 rounded-md" />
                <div className="w-full flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center w-full">
                        <div className="w-fit">
                            <Skeleton className="w-14 h-14 aspect-square rounded-full" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Skeleton className="w-1/3 min-w-[100px] max-w-[200px] h-5 rounded-md" />
                            <Skeleton className="w-full max-w-[300px] h-4 rounded-md" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                    </div>
                </div>
                <div className="w-full flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center w-full">
                        <div className="w-fit">
                            <Skeleton className="w-14 h-14 aspect-square rounded-full" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Skeleton className="w-1/3 min-w-[100px] max-w-[200px] h-5 rounded-md" />
                            <Skeleton className="w-full max-w-[300px] h-4 rounded-md" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                    </div>
                </div>
                <div className="w-full flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center w-full">
                        <div className="w-fit">
                            <Skeleton className="w-14 h-14 aspect-square rounded-full" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Skeleton className="w-1/3 min-w-[100px] max-w-[200px] h-5 rounded-md" />
                            <Skeleton className="w-full max-w-[300px] h-4 rounded-md" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}