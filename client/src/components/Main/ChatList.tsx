import { useDispatch, useSelector } from "react-redux";
import ChatListItem from "./ChatListItem";
import { RootState } from "../../redux/store";
// import { _personalChats, pinnedChats } from "../../constants/chatlist";
import { useEffect } from "react";
import { getArchiveChatsApi, getGroupChatsApi, getPersonalChatsApi, getPinnedChatsApi } from "../../api/chat.api";
import { combineGroupAndPersonalChats } from "../../utils/combineGroupAndPersonalChats";
import { setPersonalChats } from "../../redux/slices/personalChats";
import { setError } from "../../redux/slices/error";
import { setAllChats } from "../../redux/slices/allChats";
import { setGroupChats } from "../../redux/slices/groupChats";
import { setPinnedChats } from "../../redux/slices/pinnedChats";
import { setArchiveChats } from "../../redux/slices/archiveChats";
import ChatListSkeleton from "../../interface/skeletons/ChatListSkeleton";

export default function ChatList() {
    const { chatListType } = useSelector((state: RootState) => state.chatListType);
    const { allChats } = useSelector((state: RootState) => state.allChats);
    const { personalChats } = useSelector((state: RootState) => state.personalChats);
    const { groupChats } = useSelector((state: RootState) => state.groupChats);
    const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);
    const { archiveChats } = useSelector((state: RootState) => state.archiveChats);

    const dispatch = useDispatch();
    async function getPersonalChats() {
        if (personalChats !== null) {
            return
        }
        const res = await getPersonalChatsApi();
        if (res.success) {
            dispatch(setPersonalChats(res.data));
        } else {
            dispatch(setError(res.message));
        }
    }
    async function getGroupChats() {
        if (groupChats !== null) {
            return
        }
        const res = await getGroupChatsApi();
        if (res.success) {
            dispatch(setGroupChats(res.data));
        } else {
            dispatch(setError(res.message));
        }
    }
    async function getPinnedChats() {
        if (pinnedChats !== null) {
            return
        }
        const res = await getPinnedChatsApi();
        if (res.success) {
            dispatch(setPinnedChats(res.data));
        } else {
            dispatch(setError(res.message));
        }
    }
    async function getArchiveChats() {
        if (pinnedChats !== null) {
            return
        }
        const res = await getArchiveChatsApi();
        if (res.success) {
            dispatch(setArchiveChats(res.data));
        } else {
            dispatch(setError(res.message));
        }
    }

    function getAllChats() {
        if (groupChats !== null && personalChats !== null) {
            const allChats: any = combineGroupAndPersonalChats(personalChats, groupChats);
            dispatch(setAllChats(allChats));
        }
    }

    useEffect(() => {
        getPinnedChats();
        getPersonalChats();
        getGroupChats();
        getArchiveChats();
    }, []);

    useEffect(() => {
        getAllChats();
    }, [personalChats, groupChats]);


    let chatsToRender = null;
    if (chatListType === 'All') {
        chatsToRender = allChats;
    } else if (chatListType === 'Personal') {
        chatsToRender = personalChats;
    } else if (chatListType === 'Group') {
        chatsToRender = groupChats;
    } else if (chatListType === 'Archived') {
        chatsToRender = archiveChats;
    }

    if (chatsToRender === null) {
        return (
            <ChatListSkeleton />
        )
    }

    return (
        <div className="rounded-2xl w-full h-full bg-white overflow-y-scroll no-scrollbar">
            {chatListType !== 'Archived' && (
                <>
                    <h1 className="text-gray-200 mx-6 mt-6 uppercase text-sm">Pinned</h1>
                    {pinnedChats && pinnedChats.map((chat, index) => (
                        <ChatListItem
                            key={index}
                            chatId={chat.ChatId}
                            image={chat.Avatar}
                            name={chat.Name}
                            lastMessage={chat.Content}
                            lastMessageTime={chat.TimeStamp}
                            notification={chat.unSeenMessages}
                            isActive={true}
                        />
                    ))}
                </>
            )}

            <h1 className="text-gray-200 mx-6 mt-6 uppercase text-sm">{chatListType}</h1>
            {chatsToRender && chatsToRender.map((chat, index) => (
                <ChatListItem
                    key={index}
                    chatId={chat.ChatId}
                    image={chat.Avatar}
                    name={chat.Name}
                    senderName={chat.SenderName}
                    lastMessage={chat.Content}
                    lastMessageTime={chat.TimeStamp}
                    notification={chat.unSeenMessages}
                    isActive={false}
                />
            ))}
        </div>
    );
}
