import { useDispatch, useSelector } from "react-redux";
import MembersListItems from "./MembersListItems";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { getGroupInfoApi } from "../../../api/group.api";
import { setError } from "../../../redux/slices/error";

interface GroupInfo {
    GroupId: number;
    GroupName: string;
    Description: string;
    Avatar: string;
    CreatorId: number;
    CreatedBy: string;
    DateCreated: string;
    ChatId: number;
    Members: {
        UserId: number;
        Name: string;
        Avatar: string;
        Bio: string;
        isAdmin: number;
    }[];
}

export default function GroupInfo() {
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const getGroupInfo = async () => {
        const res = await getGroupInfoApi(1);
        if (res.success) {
            setGroupInfo(res.data);
        } else {
            dispatch(setError(res.message));
        }
    }

    useEffect(() => {
        getGroupInfo();
    }, [])

    if (groupInfo === null) {
        return <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar" />

    }

    const userItselfAdmin = groupInfo.Members.some(
        (member) => member.UserId === user?.UserId && member.isAdmin
    );


    return (
        <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
            <div className="bg-white rounded-2xl p-4">
                <div className="rounded-full overflow-hidden mx-auto w-44 h-44">
                    <img src={groupInfo.Avatar} alt="avatar" />
                </div>
                <div className="flex flex-col gap-1 items-center w-full mt-3">
                    <h1 className="text-2xl font-semibold">{groupInfo.GroupName}</h1>
                    <p className="text-gray-300">Group • {groupInfo.Members.length} Members</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-4">
                <h1 className="text-gray-300 mt-2">Created By</h1>
                <p>{groupInfo.CreatedBy} on {new Date(groupInfo.DateCreated).toLocaleString()}</p>
                <h1 className="text-gray-300 mt-2">Description</h1>
                <p>{groupInfo.Description}</p>
            </div>
            <div className="bg-white rounded-2xl">
                <h1 className="text-gray-300 p-4">Members</h1>
                {groupInfo.Members.map((member) => (
                    <MembersListItems key={member.UserId} member={member} userItselfAdmin={userItselfAdmin} />
                ))}
            </div>
        </div>
    )
}
