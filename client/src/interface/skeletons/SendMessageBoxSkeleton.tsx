import { IoSend } from "react-icons/io5";
import Skeleton from "./Skeleton";

export default function SendMessageBoxSkeleton() {
    return (
        <div className="flex flex-col gap-1 rounded-2xl bg-white w-full p-4">

            {/* Skeleton for the message input form */}
            <div className="relative flex gap-2 items-center">
                {/* Emoji Picker Button Skeleton */}
                <Skeleton className="h-10 w-10 rounded-full" />

                {/* Input field skeleton */}
                <Skeleton className="flex-grow h-10 rounded-md" />

                {/* Send button skeleton */}
                <IoSend className="text-gray-200 text-2xl cursor-pointer animate-pulse" />
            </div>
        </div>
    );
}
