import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoPersonAdd } from "react-icons/io5";
import { MdOutlineMessage, MdEdit } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { motion } from "framer-motion";
import MembersListItems from "./MembersListItems";
import { useMenu } from "../../../hooks/useMenu";
import { ClipLoader } from "react-spinners";
import themeColor from "../../../config/theme.config";
import UserSearchAndSelect from "./UserSearchAndSelect";
import Emoji_Picker from "../../Emoji_Picker";
import useGroupInfo from "../../../hooks/useGroupInfo";
import { useChatArchiving } from "../../../hooks/useArchivingChat";
import { usePiningChat } from "../../../hooks/usePiningChat";
import InfoSkeleton from "../../../interface/skeletons/InfoSkeleton";

export default function GroupInfo() {
    const { showMenu, setShowMenu, menuRef } = useMenu();
    const {
        groupInfo,
        setGroupInfo,
        userItselfAdmin,
        loading,
        setLoading,
        addMemberSearch,
        setAddMemberSearch,
        groupName,
        setGroupName,
        groupDesc,
        setGroupDesc,
        groupAvatar,
        setGroupAvatar,
        leaveGroup,
        deleteGroup,
        addMembers,
        handleEditGroupNameClick,
        handleEditGroupDescClick,
        updateGroup,
        extractUserIds,
        handleImageChange,
        updating,
        setUpdating
    } = useGroupInfo();

    const { isArchived, archiveChat, unArchiveChat } = useChatArchiving({ chatId: groupInfo !== null ? groupInfo?.ChatId : -1, chatType: 'group', setLoading });
    const { isPinned, pinChat, unPinChat } = usePiningChat({ chatId: groupInfo !== null ? groupInfo?.ChatId : -1, chatType: 'group', setLoading });

    if (groupInfo === null) {
        return <InfoSkeleton />

    }

    if (addMemberSearch) {
        {/* search component for the add member search */ }
        return (
            <UserSearchAndSelect notInclude={extractUserIds()} onClose={() => { setAddMemberSearch(false) }} proceed={addMembers} />
        )
    }

    return (
        <>
            <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar rounded-2xl overflow-hidden">
                <div className="bg-white rounded-2xl p-4">
                    <div className="relative flex justify-center">
                        {updating ? <ClipLoader size={30} color={themeColor} className="top-0 absolute z-10" /> : <></>}
                    </div>
                    <div className="flex justify-end relative" ref={menuRef}>
                        {showMenu && !loading &&
                            <motion.div
                                initial={{ opacity: 0, y: '-50%' }}
                                animate={{ opacity: 1, y: '0%' }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg py-2 shadow absolute top-0 right-0 z-10">
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
                                    <li onClick={leaveGroup} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Leave Group</li>
                                    {userItselfAdmin &&
                                        <li onClick={deleteGroup} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Delete Group</li>
                                    }
                                </ul>
                            </motion.div>
                        }
                        {loading ? <ClipLoader size={20} color={themeColor} /> : <BsThreeDotsVertical onClick={() => setShowMenu(true)} className="cursor-pointer" />}
                    </div>
                    <div className="relative rounded-full overflow-hidden mx-auto w-44 h-44 group cursor-pointer bg-gray">
                        {userItselfAdmin && <div
                            onClick={() => document.getElementById('file-input')?.click()}
                            className="flex justify-center items-center absolute top-0 left-0 bg-gray-200 w-full h-full opacity-0 group-hover:opacity-100 group-hover:bg-opacity-60"
                        >
                            <MdEdit size={40} className="cursor-pointer" />
                        </div>}
                        <img src={groupAvatar === null ? groupInfo.Avatar : groupAvatar} alt="avatar" className={`w-full h-full object-cover ${updating ? 'animate-pulse' : ''}`} />
                        {userItselfAdmin && <input
                            type="file"
                            id="file-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            className='absolute inset-0 opacity-0 cursor-pointer'
                        />}
                    </div>
                    {groupAvatar !== null &&
                        <div className="flex justify-center mt-2 gap-2">
                            <button disabled={updating} onClick={updateGroup} className="bg-orange disabled:bg-opacity-70 text-white text-lg- px-4 py-2 rounded-lg">Upload</button>
                            <button disabled={updating} onClick={() => { setGroupAvatar(null); setUpdating(false) }} className="bg-black disabled:bg-opacity-70 text-white text-lg- px-4 py-2 rounded-lg">Cancel</button>
                        </div>
                    }
                    <div className="flex flex-col gap-1 items-center w-full mt-3">
                        <div className="flex gap-2 items-center max-w-full">
                            {groupName === null ?
                                <h1 className="text-2xl font-semibold text-wrap text-center w-full">{groupInfo.GroupName}</h1> :
                                <form onSubmit={updateGroup} className="relative flex items-center gap-2 text-2xl border-b-2 p-2 w-full">
                                    <input required className="font-semibold focus:outline-none w-full" type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                                    <Emoji_Picker emojiPicketClassName="top-[60px] -right-10 lg:right-0" onPickup={(emoji: string) => { setGroupName(`${groupName}${emoji}`) }} />
                                    <button type="submit">
                                        <AiOutlineCheck className="cursor-pointer" size={26} />
                                    </button>
                                </form>
                            }
                            {userItselfAdmin && <MdEdit onClick={handleEditGroupNameClick} size={25} className="cursor-pointer text-lg" />}
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
                        <Link to={`/chat/${groupInfo?.ChatId}`} className="border border-black p-4 flex items-center justify-center rounded-md group hover:bg-black cursor-pointer">
                            <MdOutlineMessage size={30} className="text-black group-hover:text-white" />
                        </Link>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4">
                    <h1 className="text-gray-300 mt-2">Created By</h1>
                    <p>{groupInfo.CreatedBy} on {new Date(groupInfo.DateCreated).toLocaleString()}</p>
                    <h1 className="text-gray-300 mt-2">Description</h1>
                    <div className="flex gap-2 items-center w-fit max-w-full">
                        {groupDesc === null ?
                            <p className="w-full">{groupInfo.Description}</p> :
                            <form onSubmit={updateGroup} className="relative flex gap-2 border-b-2 p-2 w-full">
                                <input required className="focus:outline-none w-full" type="text" placeholder="Group Name" value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} />
                                <Emoji_Picker emojiPicketClassName="top-10 -right-10" onPickup={(emoji: string) => { setGroupDesc(`${groupDesc}${emoji}`) }} />
                                <button type="submit">
                                    <AiOutlineCheck className="cursor-pointer" size={25} />
                                </button>
                            </form>
                        }
                        {userItselfAdmin && <MdEdit onClick={handleEditGroupDescClick} size={25} className="cursor-pointer" />}
                    </div>
                </div>
                <div className="bg-white rounded-2xl w-full">
                    <h1 className="text-gray-300 p-4">Members</h1>
                    {groupInfo.Members.map((member) => (
                        <MembersListItems key={member.UserId} member={member} userItselfAdmin={userItselfAdmin} groupId={groupInfo?.GroupId} setGroupInfo={setGroupInfo} />
                    ))}
                </div>
            </div>
        </>
    )
}