import { LuArchiveRestore } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { TiPinOutline } from "react-icons/ti";
import GroupInCommonListItems from "../GroupInCommonListItems";
import { getFriendInfoApi } from "../../../api/user.api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setError } from "../../../redux/slices/error";
import friendType from "../../../types/friend.type";

export default function PersonalInfo() {
    const [friend, setFriend] = useState<null | friendType>(null);
    const dispatch = useDispatch();

    const getFriendInfo = async () => {
        const res = await getFriendInfoApi(6);
        if (res.success) {
            setFriend(res.data);
        }
        else {
            dispatch(setError(res.message));
        }
    }

    useEffect(() => {
        getFriendInfo();
    }, [])

    if (friend === null) {
        return <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar"></div>
    }

    return (
        <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
            <div className="bg-white rounded-2xl p-4">
                <div className="rounded-full overflow-hidden mx-auto w-44 h-44">
                    <img src={friend.Avatar} alt="avatar" />
                </div>
                <div className="flex flex-col gap-1 items-center w-full mt-3">
                    <h1 className="text-2xl font-semibold">{friend.Name}</h1>
                    <a href="mailto:mu8494759@gmail.com" className="text-gray-300 hover:text-blue-400">{friend.Email}</a>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-4">
                <h1 className="text-gray-300">About</h1>
                <p>{friend.Bio}</p>
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
