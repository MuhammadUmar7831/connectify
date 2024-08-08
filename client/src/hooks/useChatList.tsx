import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getSocket } from "../config/scoket.config";
import { getArchiveChatsApi, getGroupChatsApi, getPersonalChatsApi, getPinnedChatsApi } from "../api/chat.api";
import { setPersonalChats } from "../redux/slices/personalChats";
import { setError } from "../redux/slices/error";
import { setGroupChats } from "../redux/slices/groupChats";
import { setPinnedChats } from "../redux/slices/pinnedChats";
import { setArchiveChats } from "../redux/slices/archiveChats";
import { combineGroupAndPersonalChats } from "../utils/combineGroupAndPersonalChats";
import { setAllChats } from "../redux/slices/allChats";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function useChatList() {
    const { chatListType } = useSelector((state: RootState) => state.chatListType);
    const { allChats } = useSelector((state: RootState) => state.allChats);
    const { personalChats } = useSelector((state: RootState) => state.personalChats);
    const { groupChats } = useSelector((state: RootState) => state.groupChats);
    const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);
    const { archiveChats } = useSelector((state: RootState) => state.archiveChats);
    const { chatId } = useParams<{ chatId: string }>();

    const [onlineUser, setOnlineUsers] = useState<number[]>([]); // state to store all active users

    const socket = getSocket(); // getting singleton socket instance
    const dispatch = useDispatch();

    // api call for personal chats (also dispatch result in redux slice)
    async function getPersonalChats() {
        if (personalChats !== null) {
            return;
        }
        const res = await getPersonalChatsApi();
        if (res.success) {
            dispatch(setPersonalChats(res.data));
        } else {
            dispatch(setError(res.message));
        }
    }

    // api call for group chats (also dispatch result in redux slice)
    async function getGroupChats() {
        if (groupChats !== null) {
            return;
        }
        const res = await getGroupChatsApi();
        if (res.success) {
            dispatch(setGroupChats(res.data));
        } else {
            dispatch(setError(res.message));
        }
    }

    // api call for pinned chats (also dispatch result in redux slice)
    async function getPinnedChats() {
        if (pinnedChats !== null) {
            return;
        }
        const res = await getPinnedChatsApi();
        if (res.success) {
            dispatch(setPinnedChats(res.data));
        } else {
            dispatch(setError(res.message));
        }
    }

    // api call for archive chats (also dispatch result in redux slice)
    async function getArchiveChats() {
        if (archiveChats !== null) {
            return;
        }
        const res = await getArchiveChatsApi();
        if (res.success) {
            dispatch(setArchiveChats(res.data));
        } else {
            dispatch(setError(res.message));
        }
    }

    // call the utility function that merge group and personal chat and sort them 
    // in decreasing order by timestamp
    function getAllChats() {
        if (groupChats !== null && personalChats !== null) {
            const allChats: any = combineGroupAndPersonalChats(personalChats, groupChats);
            dispatch(setAllChats(allChats));
        }
    }

    // on mounting get all the chats from api
    useEffect(() => {
        getPinnedChats();
        getPersonalChats();
        getGroupChats();
        getArchiveChats();
    }, []);

    // check if this user is online or not
    const isActive = (userId: number | null) => {
        return onlineUser.includes(userId || -1);
    };

    // listen to event (emitted every time someone joins or leave socket) 
    // return all the online users
    useEffect(() => {
        if (socket) {
            const handleGetOnlineUsers = (users: number[]) => {
                setOnlineUsers(users);
            };

            socket.on("getOnlineUsers", handleGetOnlineUsers);

            return () => {
                socket.off("getOnlineUsers", handleGetOnlineUsers);
            };
        }
    }, [socket]);

    // after the personal and group chat is received from api merge them to get all chats
    useEffect(() => {
        getAllChats();
    }, [personalChats, groupChats]);

    let chatsToRender = null; // variable that render chat based on selected chat
    if (chatListType === 'All') {
        chatsToRender = allChats;
    } else if (chatListType === 'Personal') {
        chatsToRender = personalChats;
    } else if (chatListType === 'Group') {
        chatsToRender = groupChats;
    } else if (chatListType === 'Archived') {
        chatsToRender = archiveChats;
    }

    return {
        chatsToRender,
        pinnedChats,
        chatListType,
        isActive,
    };
}
