import { LuArchiveRestore } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { TiPinOutline } from "react-icons/ti";
import GroupInCommonListItems from "../GroupInCommonListItems";

export default function PersonalInfo() {
    return (
        <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
            <div className="bg-white rounded-2xl p-4">
                <div className="rounded-full overflow-hidden mx-auto w-44 h-44">
                    <img src="https://avatars.githubusercontent.com/u/131664477?v=4" alt="avatar" />
                </div>
                <div className="flex flex-col gap-1 items-center w-full mt-3">
                    <h1 className="text-2xl font-semibold">Muhammad Umar</h1>
                    <a href="mailto:mu8494759@gmail.com" className="text-gray-300 hover:text-blue-400">mu8494759@gmail.com</a>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-4">
                <h1 className="text-gray-300">About</h1>
                <p>محمد عمر ✍️</p>
            </div>
            <div className="bg-white rounded-2xl p-4">
                <h1 className="text-gray-300">21 Groups in Common</h1>
                <GroupInCommonListItems />
                <GroupInCommonListItems />
            </div>
            <div className="bg-white rounded-2xl p-4 flex justify-center items-center gap-4">
                <div>
                    <TiPinOutline className="text-orange text-2xl cursor-pointer" />
                </div>
                <div>
                    <LuArchiveRestore className="text-green-500 text-2xl cursor-pointer" />
                </div>
                <div>
                    <RiDeleteBinLine className="text-red-500 text-2xl cursor-pointer" />
                </div>
            </div>
        </div>
    )
}
