import GroupInCommonListItems from "./GroupInCommonListItems";
import { getFriendInfoApi } from "../../../api/user.api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setError } from "../../../redux/slices/error";
import friendType from "../../../types/friend.type";
import { getCommonGroupsApi } from "../../../api/group.api";
import { GroupListItem } from "../../../types/groupListItem.type";
import { useMenu } from "../../../hooks/useMenu";
import { usePiningChat } from "../../../hooks/usePiningChat";
import { useChatArchiving } from "../../../hooks/useArchivingChat";
import { ClipLoader } from "react-spinners";
import themeColor from "../../../config/theme.config";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RootState } from "../../../redux/store";
import { Link } from "react-router-dom";
import { MdOutlineMessage } from "react-icons/md";

export default function PersonalInfo() {
    const [friend, setFriend] = useState<null | friendType>(null);
    const [commonGroups, setCommonGroups] = useState<null | GroupListItem[]>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.user);
    const { showMenu, setShowMenu, menuRef } = useMenu();
    const dispatch = useDispatch();

    const getFriendInfo = async () => {
        if (user) {
            const res = await getFriendInfoApi(2, user.UserId);
            if (res.success) {
                setFriend(res.data);
            }
            else {
                dispatch(setError(res.message));
            }
        }
    }

    const getCommonGroups = async () => {
        const res = await getCommonGroupsApi(2);
        if (res.success) {
            setCommonGroups(res.data);
        } else {
            dispatch(setError(res.message));
        }
    }

    const { isArchived, archiveChat, unArchiveChat } = useChatArchiving({ chatId: friend !== null && friend.ChatId !== null ? friend.ChatId : -1, chatType: 'personal', setLoading });
    const { isPinned, pinChat, unPinChat } = usePiningChat({ chatId: friend !== null && friend.ChatId !== null ? friend.ChatId : -1, chatType: 'personal', setLoading });

    useEffect(() => {
        getFriendInfo();
        getCommonGroups();
    }, [])

    if (friend === null || commonGroups === null) {
        return <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar"></div>
    }

    return (
        <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
            <div className="bg-white rounded-2xl p-4">
                {friend.ChatId &&
                    <div className="flex justify-end relative" ref={menuRef}>
                        {showMenu &&
                            <motion.div
                                initial={{ opacity: 0, y: '-50%' }}
                                animate={{ opacity: 1, y: '0%' }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg py-2 shadow absolute top-0 right-0">
                                <ul>
                                    {isArchived ? // first check if chat is archive if yes than user can unarchive it 
                                        // only if no than check uf chat is pinned if yes than user can only unpin 
                                        // it or archive it if no user can pin it or archive it
                                        <li onClick={() => { setShowMenu(false); unArchiveChat() }} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">UnArchive Chat</li> :
                                        <>
                                            <li onClick={() => { setShowMenu(false); archiveChat() }} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Archive Chat</li>
                                            {isPinned ?
                                                <li onClick={() => { setShowMenu(false); unPinChat() }} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">UnPin Chat</li> :
                                                <li onClick={() => { setShowMenu(false); pinChat() }} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Pin Chat</li>
                                            }
                                        </>
                                    }
                                    {/* <li onClick={leaveGroup} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Leave Group</li> */}
                                </ul>
                            </motion.div>
                        }
                        {loading ? <ClipLoader size={20} color={themeColor} /> : <BsThreeDotsVertical onClick={() => setShowMenu(true)} className="cursor-pointer" />}
                    </div>
                }
                <div className="rounded-full overflow-hidden mx-auto w-44 h-44">
                    <img src={friend.Avatar} alt="avatar" />
                </div>
                <div className="flex flex-col gap-1 items-center w-full mt-3">
                    <h1 className="text-2xl font-semibold">{friend.Name}</h1>
                    <a href="mailto:mu8494759@gmail.com" className="text-gray-300 hover:text-blue-400">{friend.Email}</a>
                </div>
                {friend.ChatId &&
                    <div className="flex justify-center mt-5 gap-2">
                        <Link to={`/chat/${friend.ChatId}`} className="border border-black p-4 flex items-center justify-center rounded-md group hover:bg-black cursor-pointer">
                            <MdOutlineMessage size={30} className="text-black group-hover:text-white" />
                        </Link>
                    </div>
                }
            </div>
            <div className="bg-white rounded-2xl p-4">
                <h1 className="text-gray-300">About</h1>
                <p>{friend.Bio}</p>
            </div>
            <div className="bg-white rounded-2xl py-4">
                <h1 className="text-gray-300 p-4">{commonGroups.length > 0 ? commonGroups.length : 'No '} Groups in Common</h1>
                {commonGroups.map((commonGroup) =>
                    <GroupInCommonListItems group={commonGroup} key={commonGroup.GroupId} />
                )}
            </div>
        </div>
    )
}
