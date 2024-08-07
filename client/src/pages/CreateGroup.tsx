import { MdArrowForward, MdEdit } from "react-icons/md";
import Emoji_Picker from "../components/Emoji_Picker";
import { ChangeEvent, useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import UserSearchAndSelect from "../components/Info/Group/UserSearchAndSelect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { User } from "../types/user.type";
import { IoIosCloseCircle } from "react-icons/io";
import { createGroupApi } from "../api/group.api";
import { setError } from "../redux/slices/error";
import { setSuccess } from "../redux/slices/success";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { setGroupChats } from "../redux/slices/groupChats";
import Chat from "../types/chat.types";
import useCloudinary from "../hooks/useCloudinary";

export default function CreateGroup() {
    const [groupName, setGroupName] = useState<string>("");
    const [groupDesc, setGroupDesc] = useState<string>("");
    const [groupAvatar, setGroupAvatar] = useState<string>("/group.png");
    const [groupAvatarFile, setGroupAvatarFile] = useState<null | File>(null);
    const [addMemberSearch, setAddMemberSearch] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.user);
    const { groupChats } = useSelector((state: RootState) => state.groupChats);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { uploadImage } = useCloudinary();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setSelectedUsers([user]);
        }
    }, [user]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setGroupAvatarFile(file)
            if (!file.type.startsWith('image/')) {
                dispatch(setError('The selected file is not an image'));
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setGroupAvatar(imageUrl);
        }
    };

    const deSelectUser = (userId: number) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.filter(user => user.UserId !== userId)
        );
    };

    const extractIds = () => {
        return selectedUsers.map(user => user.UserId);
    };

    const proceedWithSelectedUsers = (users: User[]) => {
        setSelectedUsers((prev) => [...prev, ...users]);
        setAddMemberSearch(false);
    };

    const createGroup = async () => {
        if (groupName === "" || groupAvatar === "" || groupDesc === "" || selectedUsers.length < 2) {
            dispatch(setError('Please Enter Values'));
            return;
        }
        setLoading(true);

        let avatar = groupAvatar;
        if (groupAvatarFile !== null) {
            const isUploaded = await uploadImage(groupAvatarFile, user?.Name);
            console.log(isUploaded)
            if (isUploaded.success) {
                if (isUploaded.imageUrl) {
                    setGroupAvatar(isUploaded.imageUrl);
                    avatar = isUploaded.imageUrl;
                }
            } else {
                return;
            }
        }

        const members = extractIds().filter(userId => userId !== user?.UserId);
        const body = { name: groupName, avatar, description: groupDesc, members };
        const res = await createGroupApi(body);
        if (res.success) {
            dispatch(setSuccess(res.message));

            let chat: Chat = {
                ChatId: res.chatId,
                UserId: null,
                Name: groupName,
                Avatar: avatar,
                isActive: false
            };

            dispatch(setGroupChats(groupChats ? [...groupChats, chat] : [chat]));
            navigate(`/chat/${res.chatId}`);
        } else {
            dispatch(setError(res.message));
        }
        setLoading(false);
    };

    if (user && addMemberSearch) {
        return (
            <UserSearchAndSelect
                notInclude={extractIds()}
                onClose={() => setAddMemberSearch(false)}
                proceed={proceedWithSelectedUsers}
            />
        );
    }

    return (
        <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar bg-white rounded-2xl p-4">
            <div className="relative rounded-full overflow-hidden mx-auto w-42 h-42 group cursor-pointer bg-gray">
                <div
                    onClick={() => document.getElementById('file-input')?.click()}
                    className="flex justify-center items-center absolute top-0 left-0 bg-gray-200 w-full h-full opacity-0 group-hover:opacity-100 group-hover:bg-opacity-60"
                >
                    <MdEdit size={40} className="cursor-pointer" />
                </div>
                <img src={groupAvatar} alt="avatar" className="w-full h-full object-cover" />
                <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
            <form onSubmit={() => { }} className="flex flex-col gap-5 items-center w-full mt-3">
                <div className="relative flex gap-2 text-2xl border-b-2 p-2 justify-between w-1/2">
                    <input
                        required
                        className="focus:outline-none w-full"
                        type="text"
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) => { if (e.target.value.length < 30) { setGroupName(e.target.value) } }}
                    />
                    <Emoji_Picker
                        emojiPicketClassName="top-[60px] right-0 z-10"
                        onPickup={(emoji: string) => { if (`${groupName}${emoji}`.length < 30) { setGroupName(`${groupName}${emoji}`) } }}
                    />
                </div>
                <div className="relative flex gap-2 text-lg border-b p-2 w-2/3 justify-between">
                    <input
                        required
                        className="focus:outline-none w-full"
                        type="text"
                        placeholder="Group Description"
                        value={groupDesc}
                        onChange={(e) => { if (e.target.value.length < 200) { setGroupDesc(e.target.value) } }}
                    />
                    <Emoji_Picker
                        emojiPicketClassName="top-[60px] right-0 z-10"
                        onPickup={(emoji: string) => { if (`${groupDesc}${emoji}`.length < 200) { setGroupDesc(`${groupDesc}${emoji}`) } }}
                    />
                </div>
            </form>
            <div className="flex justify-center mt-5 gap-2">
                <div
                    onClick={() => setAddMemberSearch(true)}
                    className="border border-black p-4 flex items-center justify-center rounded-md group hover:bg-black cursor-pointer"
                >
                    <IoPersonAdd size={30} className="text-black group-hover:text-white" />
                </div>
            </div>
            {
                selectedUsers.length > 0 && (
                    <h1 className="p-4 text-2xl">
                        Members <span className="text-base">(including you)</span>
                    </h1>
                )
            }
            <div className="flex px-4 gap-5">
                {selectedUsers.map((selectedUser) => (
                    <div key={selectedUser.UserId} className="relative w-fit">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img className="object-contain" src={selectedUser.Avatar} alt={selectedUser.Name} />
                        </div>
                        {selectedUser.UserId !== user?.UserId && (
                            <div
                                onClick={() => deSelectUser(selectedUser.UserId)}
                                className="w-fit bg-white rounded-full absolute bottom-0 right-0 cursor-pointer"
                            >
                                <IoIosCloseCircle size={20} className="text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {
                !(groupName === "" || groupAvatar === "" || groupDesc === "" || selectedUsers.length < 2) ?
                    loading ?
                        <div
                            className="fixed bottom-[50px] right-[50px] w-fit p-4 rounded-full bg-orange cursor-pointer group animate-pulse">
                            <MdArrowForward size={30} className="text-white" />
                        </div>
                        :
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="fixed bottom-[50px] right-[50px] w-fit p-4 rounded-full border border-orange bg-orange hover:bg-white cursor-pointer group"
                            onClick={createGroup}>
                            <MdArrowForward size={30} className="text-white group-hover:text-orange" />
                        </motion.div> : <></>
            }
        </div >
    );
}
