import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setPersonalChats } from "../redux/slices/personalChats";
import { setGroupChats } from "../redux/slices/groupChats";
import { setPinnedChats } from "../redux/slices/pinnedChats";
import { setArchiveChats } from "../redux/slices/archiveChats";
import { getSocket } from "../config/scoket.config";
import Chat from "../types/chat.types";
import { useParams } from "react-router-dom";

export default function useSyncChatList() {
    const { personalChats } = useSelector((state: RootState) => state.personalChats);
    const { groupChats } = useSelector((state: RootState) => state.groupChats);
    const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);
    const { archiveChats } = useSelector((state: RootState) => state.archiveChats);

    const socket = getSocket();
    const dispatch = useDispatch();
    const { chatId } = useParams<{ chatId: string }>();

    // Create a memoized hashmap to store chatId to chat type mapping
    const chatTypeMap = useMemo(() => {
        const map = new Map<number, 'personal' | 'group' | 'pinned' | 'archive'>();

        personalChats?.forEach(chat => map.set(chat.ChatId, 'personal'));
        groupChats?.forEach(chat => map.set(chat.ChatId, 'group'));
        pinnedChats?.forEach(chat => map.set(chat.ChatId, 'pinned'));
        archiveChats?.forEach(chat => map.set(chat.ChatId, 'archive'));

        return map;
    }, [personalChats, groupChats, pinnedChats, archiveChats]);

    const messageReceived = (data?: any) => {
        const { ChatId, Content, Timestamp, UserStatus, Sender, SenderId } = data;
        if (chatId != ChatId) {
            // if this chat is not view whose message is received than play audio
            document.getElementById("notification")?.click();
        }
        const chatType = chatTypeMap.get(ChatId);

        // local function that actually return the passed state with updated status
        const updateChatArray = (chats: any) => {
            return chats.map((chat: any) => {
                if (chat.ChatId == ChatId) { // this is the chat i want to push notification to
                    if (chat.ChatId == chatId) { // this chat is in view
                        return {
                            ...chat,
                            SenderName: Sender,
                            SenderId,
                            Content,
                            Timestamp,
                            UserStatus,
                            unSeenMessages: 0,
                        };
                    } else { // chat not in view
                        return {
                            ...chat,
                            Content,
                            Timestamp,
                            UserStatus,
                            unSeenMessages: (chat.unSeenMessages || 0) + 1,
                        };
                    }
                }
                return chat;
            });
        };

        switch (chatType) {
            case 'personal':
                dispatch(setPersonalChats(updateChatArray(personalChats)));
                break;
            case 'group':
                dispatch(setGroupChats(updateChatArray(groupChats)));
                break;
            case 'pinned':
                dispatch(setPinnedChats(updateChatArray(pinnedChats)));
                break;
            case 'archive':
                dispatch(setArchiveChats(updateChatArray(archiveChats)));
                break;
        }
    };

    const allMessagesSeen = (userId: string, _chatId: string) => {
        if (chatId !== _chatId) { return }
        const chatType = chatTypeMap.get(parseInt(chatId));

        const updateChatArray = (chats: Chat[] | null) => {
            if (!chats) { return null }
            return chats.map((chat: Chat) => {
                if (chat.ChatId == parseInt(chatId)) { // this is the chat i want to set un seen messages to 0
                    let newUserStatus = null;
                    if (chat.UserStatus) {
                        newUserStatus = chat.UserStatus.map((status) => (
                            status.UserId === parseInt(userId) ? { ...status, Status: 'seen' } : status
                        ))
                    }
                    return {
                        ...chat,
                        UserStatus: newUserStatus,
                        unSeenMessages: 0,
                    };

                } else
                    return chat;
            });
        };

        switch (chatType) {
            case 'personal':
                dispatch(setPersonalChats(updateChatArray(personalChats)));
                break;
            case 'group':
                dispatch(setGroupChats(updateChatArray(groupChats)));
                break;
            case 'pinned':
                dispatch(setPinnedChats(updateChatArray(pinnedChats)));
                break;
            case 'archive':
                dispatch(setArchiveChats(updateChatArray(archiveChats)));
                break;
        }
    };

    const singleMessageHasBeenSeen = (userId: string, chatId: number) => {
        const chatType = chatTypeMap.get(chatId);
        // local function that actually return the passed state with updated status
        const updateChatArray = (chats: Chat[] | null) => {
            if (!chats) { return null }
            return chats.map((chat: Chat) => {
                if (chat.ChatId === chatId) { // this is the chat i want to update the status calculated as one user seen the last message
                    let newUserStatus = null;
                    if (chat.UserStatus) {
                        newUserStatus = chat.UserStatus.map((status) => (
                            status.UserId === parseInt(userId) ? { ...status, Status: 'seen' } : status
                        ))
                    }
                    return {
                        ...chat,
                        UserStatus: newUserStatus,
                    };

                } else
                    return chat;
            });
        };

        switch (chatType) {
            case 'personal':
                dispatch(setPersonalChats(updateChatArray(personalChats)));
                break;
            case 'group':
                dispatch(setGroupChats(updateChatArray(groupChats)));
                break;
            case 'pinned':
                dispatch(setPinnedChats(updateChatArray(pinnedChats)));
                break;
            case 'archive':
                dispatch(setArchiveChats(updateChatArray(archiveChats)));
                break;
        }
    };

    const setSentStatusToReceived = (userId: string) => {
        // local function that actually return the passed state with updated status
        const updateChatArray = (chats: Chat[] | null) => {
            if (!chats) { return null }
            return chats.map((chat: Chat) => {
                let newUserStatus = null;
                if (chat.UserStatus) {
                    newUserStatus = chat.UserStatus.map((status) => (
                        status.UserId === parseInt(userId) && status.Status === 'sent' ? { ...status, Status: 'received' } : status
                    ))
                }
                return {
                    ...chat,
                    UserStatus: newUserStatus,
                };

            });
        };

        // received status is set for all chats
        dispatch(setPersonalChats(updateChatArray(personalChats)));
        dispatch(setGroupChats(updateChatArray(groupChats)));
        dispatch(setPinnedChats(updateChatArray(pinnedChats)));
        dispatch(setArchiveChats(updateChatArray(archiveChats)));
    }

    const chatIsBeingCreated = (data: Chat, type: 'personal' | 'group' | 'pinned' | 'archive') => {
        const updateChatArray = (chats: Chat[] | null) => {
            if (!chats) { return null }
            return [...chats, data]
        };

        if (type === 'personal') {
            dispatch(setPersonalChats(updateChatArray(personalChats)));
        } else if (type == "group") {
            dispatch(setGroupChats(updateChatArray(groupChats)));
        }
    }

    const popChat = (chatId: number) => {
        const chatType = chatTypeMap.get(chatId);
        console.log(chatId, typeof chatId, chatType);

        const updateChatArray = (chats: Chat[] | null) => {
            if (!chats) { return null }
            const updatedChats = chats.filter((chat) => chat.ChatId !== chatId);
            return updatedChats;
        };

        switch (chatType) {
            case 'personal':
                dispatch(setPersonalChats(updateChatArray(personalChats)));
                break;
            case 'group':
                dispatch(setGroupChats(updateChatArray(groupChats)));
                break;
            case 'pinned':
                dispatch(setPinnedChats(updateChatArray(pinnedChats)));
                break;
            case 'archive':
                dispatch(setArchiveChats(updateChatArray(archiveChats)));
                break;
        }
    }

    useEffect(() => {
        if (socket) {
            // socket function that listen to the message that is newly received (wether i sent it or anyone else)
            socket.on("messageReceived", messageReceived);
            socket.on("seenAllMessage", allMessagesSeen)
            socket.on("singleMessageHasBeenSeen", singleMessageHasBeenSeen)
            socket.on("userOnline", setSentStatusToReceived)
            socket.on("chatIsBeingCreated", chatIsBeingCreated)
            socket.on("chatLeft", popChat)
            socket.on("chatDeleted", popChat)

            // Clean up the socket listener when the component unmounts
            return () => {
                socket.off("messageReceived", messageReceived);
                socket.off("seenAllMessage", allMessagesSeen)
                socket.off("singleMessageHasBeenSeen", singleMessageHasBeenSeen)
                socket.off("userOnline", setSentStatusToReceived)
                socket.off("chatIsBeingCreated")
                socket.off("chatLeft")
                socket.off("chatDeleted")
            };
        }
    }, [socket, chatId, personalChats, groupChats, archiveChats, pinnedChats]);

    useEffect(() => {
        if (socket && chatId) { // socket and chat id must not be null or undefined
            socket.emit('chatOpened', chatId);
            return () => {
                socket.off("chatOpened");
            }
        }
    }, [socket, chatId]);
}
