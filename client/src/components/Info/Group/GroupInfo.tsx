import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion } from "framer-motion";
import MembersListItems from "./MembersListItems";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { getGroupInfoApi, leaveGroupApi } from "../../../api/group.api";
import { setError } from "../../../redux/slices/error";
import GroupInfoResponse from "../../../types/groupInfo.type";
import { setSuccess } from "../../../redux/slices/success";
import { useMenu } from "../../../hooks/useMenu";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export default function GroupInfo() {
    const [groupInfo, setGroupInfo] = useState<GroupInfoResponse | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const { showMenu, setShowMenu, menuRef } = useMenu();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

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

    const leaveGroup = async () => {
        setShowMenu(false);
        setLoading(true);
        const res = await leaveGroupApi({ groupId: groupInfo?.GroupId });
        if (res.success) {
            dispatch(setSuccess(res.message));
            navigate("/");
        } else {
            dispatch(setError(res.message));
        }
        setLoading(false);
    }
    // leaveGroup();

    return (
        <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
            <div className="bg-white rounded-2xl p-4">
                <div className="flex justify-end relative" ref={menuRef}>
                    {showMenu &&
                        <motion.div
                            initial={{ opacity: 0, y: '-50%' }}
                            animate={{ opacity: 1, y: '0%' }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg py-2 shadow absolute top-0 right-0">
                            <ul>
                                <li onClick={() => { }} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Edit Group</li>
                                <li onClick={leaveGroup} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Leave Group</li>
                            </ul>
                        </motion.div>
                    }
                    {loading ? <ClipLoader size={20} color="#FF4D0C" /> : <BsThreeDotsVertical onClick={() => setShowMenu(true)} className="cursor-pointer" />}
                </div>
                <div className="rounded-full overflow-hidden mx-auto w-44 h-44">
                    <img src={groupInfo.Avatar} alt="avatar" />
                    {/* leave group icon */}
                    {/* add member icon */}

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
                    <MembersListItems key={member.UserId} member={member} userItselfAdmin={userItselfAdmin} groupId={groupInfo?.GroupId} setGroupInfo={setGroupInfo} />
                ))}
            </div>
        </div>
    )
}
