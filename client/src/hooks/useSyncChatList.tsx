import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setPersonalChats } from "../redux/slices/personalChats";
import { setGroupChats } from "../redux/slices/groupChats";
import { setPinnedChats } from "../redux/slices/pinnedChats";
import { setArchiveChats } from "../redux/slices/archiveChats";
import { getSocket } from "../config/scoket.config";
import { useParams } from "react-router-dom";
import Chat from "../types/chat.types";

export default function useSyncChatList() {
    const { personalChats } = useSelector((state: RootState) => state.personalChats);
    const { groupChats } = useSelector((state: RootState) => state.groupChats);
    const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);
    const { archiveChats } = useSelector((state: RootState) => state.archiveChats);

    const socket = getSocket();
    const dispatch = useDispatch();
    const { chatId } = useParams<{ chatId: string }>();

    const messageReceived = (data?: any) => {
        const { ChatId, Content, Timestamp, UserStatus, Sender, SenderId } = data;

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

        dispatch(setPersonalChats(updateChatArray(personalChats)));
        dispatch(setGroupChats(updateChatArray(groupChats)));
        dispatch(setPinnedChats(updateChatArray(pinnedChats)));
        dispatch(setArchiveChats(updateChatArray(archiveChats)));
    };

    const allMessagesSeen = (userId: string) => {
        if (!chatId) { return }
        const updateChatArray = (chats: Chat[] | null) => {
            if (!chats) { return [] }
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

        dispatch(setPersonalChats(updateChatArray(personalChats)));
        dispatch(setGroupChats(updateChatArray(groupChats)));
        dispatch(setPinnedChats(updateChatArray(pinnedChats)));
        dispatch(setArchiveChats(updateChatArray(archiveChats)));
    };

    const singleMessageHasBeenSeen = (userId: string, chatId: number) => {
        // local function that actually return the passed state with updated status
        const updateChatArray = (chats: Chat[] | null) => {
            if (!chats) { return [] }
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

        dispatch(setPersonalChats(updateChatArray(personalChats)));
        dispatch(setGroupChats(updateChatArray(groupChats)));
        dispatch(setPinnedChats(updateChatArray(pinnedChats)));
        dispatch(setArchiveChats(updateChatArray(archiveChats)));
    };

    const setSentStatusToReceived = (userId: number) => {
        // local function that actually return the passed state with updated status
        const updateChatArray = (chats: Chat[] | null) => {
            if (!chats) { return [] }
            return chats.map((chat: Chat) => {
                let newUserStatus = null;
                if (chat.UserStatus) {
                    newUserStatus = chat.UserStatus.map((status) => (
                        status.UserId === userId && status.Status === 'sent' ? { ...status, Status: 'received' } : status
                    ))
                }
                return {
                    ...chat,
                    UserStatus: newUserStatus,
                };

            });
        };

        dispatch(setPersonalChats(updateChatArray(personalChats)));
        dispatch(setGroupChats(updateChatArray(groupChats)));
        dispatch(setPinnedChats(updateChatArray(pinnedChats)));
        dispatch(setArchiveChats(updateChatArray(archiveChats)));
    }

    useEffect(() => {
        if (socket) {
            // socket function that listen to the message that is newly received (wether i sent it or anyone else)
            socket.on("messageReceived", (data) => {
                messageReceived(data) // function to update chat list on left (main area)
            });
            socket.on("seenAllMessage", (userId: string) => {
                allMessagesSeen(userId);
            })
            socket.on("singleMessageHasBeenSeen", (userId, chatId) => {
                singleMessageHasBeenSeen(userId, chatId)
            })
            socket.on("userOnline", (userId: string) => {
                setSentStatusToReceived(parseInt(userId))
            })
            // Clean up the socket listener when the component unmounts
            return () => {
                socket.off("messageReceived");
                socket.off("seenAllMessage");
                socket.off("singleMessageHasBeenSeen");
                socket.off("userOnline");
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
