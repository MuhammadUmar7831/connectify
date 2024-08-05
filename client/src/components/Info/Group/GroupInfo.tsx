import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoPersonAdd } from "react-icons/io5";
import { motion } from "framer-motion";
import MembersListItems from "./MembersListItems";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { addMembersApi, getGroupInfoApi, leaveGroupApi } from "../../../api/group.api";
import { setError } from "../../../redux/slices/error";
import GroupInfoResponse from "../../../types/groupInfo.type";
import { setSuccess } from "../../../redux/slices/success";
import { useMenu } from "../../../hooks/useMenu";
import { ClipLoader } from "react-spinners";
import themeColor from "../../../config/theme.config";
import UserSearchAndSelect, { User } from "./UserSearchAndSelect";

export default function GroupInfo() {
    const [groupInfo, setGroupInfo] = useState<GroupInfoResponse | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const { showMenu, setShowMenu, menuRef } = useMenu();
    const [loading, setLoading] = useState<boolean>(false);
    const [addMemberSearch, setAddMemberSearch] = useState<boolean>(false);
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

    const extractUserIds = (): number[] => {
        return groupInfo?.Members.map(member => member.UserId);
    };

    const addMemebrs = async (users: User[]) => {
        const membersId = users.map(user => user.UserId);
        const body = { groupId: groupInfo?.GroupId, membersId: membersId }
        const res = await addMembersApi(body);
        if (res.success) {
            dispatch(setSuccess(res.message));
            setGroupInfo((prevGroupInfo) => {
                if (prevGroupInfo) {
                    return {
                        ...prevGroupInfo,
                        Members: [
                            ...prevGroupInfo.Members,
                            ...users.map(user => ({ ...user, isAdmin: 0 }))
                        ]
                    };
                }
                return prevGroupInfo;
            })
        } else {
            dispatch(setError(res.message));
        }
        setAddMemberSearch(false);
    }

    if (addMemberSearch) {
        {/* search component for the add member search */ }
        return (
            <UserSearchAndSelect notInclude={extractUserIds()} onClose={() => { setAddMemberSearch(false) }} proceed={addMemebrs} />
        )
    }

    return (
        <>
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
                        {loading ? <ClipLoader size={20} color={themeColor} /> : <BsThreeDotsVertical onClick={() => setShowMenu(true)} className="cursor-pointer" />}
                    </div>
                    <div className="rounded-full overflow-hidden mx-auto w-44 h-44">
                        <img src={groupInfo.Avatar} alt="avatar" />
                    </div>
                    <div className="flex flex-col gap-1 items-center w-full mt-3">
                        <h1 className="text-2xl font-semibold">{groupInfo.GroupName}</h1>
                        <p className="text-gray-300">Group • {groupInfo.Members.length} Members</p>
                    </div>
                    <div className="flex justify-center mt-5">
                        {userItselfAdmin &&
                            //add members only for admins 
                            <div onClick={() => setAddMemberSearch(true)} className="border border-black p-4 flex items-center justify-center rounded-md group hover:bg-black cursor-pointer">
                                <IoPersonAdd size={30} className="text-black group-hover:text-white" />
                            </div>
                        }
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
        </>
    )
}
