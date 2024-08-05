import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDotsVertical, BsEmojiGrin } from "react-icons/bs";
import { IoPersonAdd } from "react-icons/io5";
import { MdOutlineMessage, MdEdit } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { motion } from "framer-motion";
import MembersListItems from "./MembersListItems";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { addMembersApi, getGroupInfoApi, leaveGroupApi, updateGroupApi } from "../../../api/group.api";
import { setError } from "../../../redux/slices/error";
import GroupInfoResponse from "../../../types/groupInfo.type";
import { setSuccess } from "../../../redux/slices/success";
import { useMenu } from "../../../hooks/useMenu";
import { ClipLoader } from "react-spinners";
import themeColor from "../../../config/theme.config";
import UserSearchAndSelect, { User } from "./UserSearchAndSelect";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

export default function GroupInfo() {
    const [groupInfo, setGroupInfo] = useState<GroupInfoResponse | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const { showMenu, setShowMenu, menuRef } = useMenu();
    const [loading, setLoading] = useState<boolean>(false);
    const [addMemberSearch, setAddMemberSearch] = useState<boolean>(false);
    const [groupName, setGroupName] = useState<string | null>(null);
    const [groupDesc, setGroupDesc] = useState<string | null>(null);
    const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
    const [iseEmojiPickerOpent, setIseEmojiPickerOpent] = useState<boolean>(false)
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
    }

    const handleEditGroupNameClick = () => {
        if (groupName === null) {
            setGroupName(groupInfo?.GroupName)
        } else {
            setGroupName(null)
        }
    }

    const handleEditGroupDescClick = () => {
        if (groupDesc === null) {
            setGroupDesc(groupInfo?.Description)
        } else {
            setGroupDesc(null)
        }
    }

    const updateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        const newName = groupName === null ? groupInfo?.GroupName : groupName;
        const newDesc = groupDesc === null ? groupInfo?.Description : groupDesc;
        const newAvatar = groupAvatar === null ? groupInfo?.Avatar : groupAvatar;

        if (
            (newName !== groupInfo?.GroupName && newName !== "") ||
            (newDesc !== groupInfo?.Description && newDesc !== "") ||
            (newAvatar !== groupInfo?.Avatar && newAvatar !== "")
        ) {
            const body = {
                groupId: groupInfo?.GroupId,
                name: newName,
                avatar: newAvatar,
                description: newDesc
            };
            const res = await updateGroupApi(body);
            if (res.success) {
                setGroupInfo((prevGroupInfo) => {
                    if (prevGroupInfo) {
                        return {
                            ...prevGroupInfo,
                            GroupName: body.name,
                            Avatar: body.avatar,
                            Description: body.description
                        };
                    }
                    return prevGroupInfo;
                });
                dispatch(setSuccess(res.message));
            } else {
                dispatch(setError(res.message));
            }
        }
        setGroupName(null);
        setGroupDesc(null);
        setGroupAvatar(null);
    };


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
                                    <li onClick={() => { }} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Archive Group Chat</li>
                                    <li onClick={leaveGroup} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Leave Group</li>
                                </ul>
                            </motion.div>
                        }
                        {loading ? <ClipLoader size={20} color={themeColor} /> : <BsThreeDotsVertical onClick={() => setShowMenu(true)} className="cursor-pointer" />}
                    </div>
                    <div className="relative rounded-full overflow-hidden mx-auto w-44 h-44 group cursor-pointer">
                        <div className="flex justify-center items-center absolute top-0 left-0 bg-gray-200 w-full h-full opacity-0 group-hover:opacity-100 group-hover:bg-opacity-60">
                            <MdEdit size={40} className="cursor-pointer" />
                        </div>
                        <img src={groupInfo.Avatar} alt="avatar" />
                    </div>
                    <div className="flex flex-col gap-1 items-center w-full mt-3">
                        <div className="flex gap-2 items-center">
                            {groupName === null ?
                                <h1 className="text-2xl font-semibold">{groupInfo.GroupName}</h1> :
                                <form onSubmit={updateGroup} className="relative flex gap-2 text-2xl border-b-2 p-2">
                                    <input required className="font-semibold focus:outline-none" type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                                    <BsEmojiGrin className="cursor-pointer" size={25} onClick={() => setIseEmojiPickerOpent(!iseEmojiPickerOpent)} />
                                    <button type="submit">
                                        <AiOutlineCheck className="cursor-pointer" size={26} />
                                    </button>
                                    <div
                                        className="absolute top-[60px] right-0">
                                        <EmojiPicker open={iseEmojiPickerOpent} height={350} onEmojiClick={(emojiData: EmojiClickData) => { setGroupName(`${groupName}${emojiData.emoji}`) }} />
                                    </div>
                                </form>
                            }
                            <MdEdit onClick={handleEditGroupNameClick} size={25} className="cursor-pointer" />
                        </div>
                        <p className="text-gray-300">Group • {groupInfo.Members.length} Members</p>
                    </div>
                    <div className="flex justify-center mt-5 gap-2">
                        {userItselfAdmin &&
                            //add members only for admins 
                            <div onClick={() => setAddMemberSearch(true)} className="border border-black p-4 flex items-center justify-center rounded-md group hover:bg-black cursor-pointer">
                                <IoPersonAdd size={30} className="text-black group-hover:text-white" />
                            </div>
                        }
                        <Link to={`/c/${groupInfo?.ChatId}`} className="border border-black p-4 flex items-center justify-center rounded-md group hover:bg-black cursor-pointer">
                            <MdOutlineMessage size={30} className="text-black group-hover:text-white" />
                        </Link>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4">
                    <h1 className="text-gray-300 mt-2">Created By</h1>
                    <p>{groupInfo.CreatedBy} on {new Date(groupInfo.DateCreated).toLocaleString()}</p>
                    <h1 className="text-gray-300 mt-2">Description</h1>
                    <div className="flex gap-2 items-center">
                        {groupDesc === null ?
                            <p>{groupInfo.Description}</p> :
                            <form onSubmit={updateGroup} className="flex gap-2 border-b-2 p-2 w-full">
                                <input required className="focus:outline-none w-full" type="text" placeholder="Group Name" value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} />
                                <button type="submit">
                                    <AiOutlineCheck className="cursor-pointer" size={25} />
                                </button>
                            </form>
                        }
                        <MdEdit onClick={handleEditGroupDescClick} size={25} className="cursor-pointer" />
                    </div>
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
