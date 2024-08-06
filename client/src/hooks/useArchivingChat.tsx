import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setArchiveChats } from '../redux/slices/archiveChats';
import { setGroupChats } from '../redux/slices/groupChats';
import { setPersonalChats } from '../redux/slices/personalChats'; // Import the personalChats slice
import { setPinnedChats } from '../redux/slices/pinnedChats';
import { archiveChatApi, unArchiveChatApi } from '../api/chat.api';
import Chat from '../types/chat.types';
import { setError } from '../redux/slices/error';
import { setSuccess } from '../redux/slices/success';

type ChatType = 'group' | 'personal';

interface UseChatArchivingProps {
    chatId: number;
    chatType: ChatType;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useChatArchiving({ chatId, chatType, setLoading }: UseChatArchivingProps) {
    const dispatch = useDispatch();
    const { groupChats } = useSelector((state: RootState) => state.groupChats);
    const { personalChats } = useSelector((state: RootState) => state.personalChats); // Personal chats from state
    const { archiveChats } = useSelector((state: RootState) => state.archiveChats);
    const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);

    const archiveChat = async () => {
        setLoading(true);
        const res = await archiveChatApi({ chatId });
        if (res.success) {
            let chat: Chat | undefined;

            // Find the chat in the relevant chat list based on type
            if (chatType === 'group') {
                chat = groupChats?.find(chat => chat.ChatId === chatId);
                if (chat) {
                    dispatch(setGroupChats(groupChats?.filter(chat => chat.ChatId !== chatId) || []));
                } else {
                    chat = pinnedChats?.find(chat => chat.ChatId === chatId);
                    if (chat) {
                        dispatch(setPinnedChats(pinnedChats?.filter(chat => chat.ChatId !== chatId) || []));
                    }
                }
            } else {
                chat = personalChats?.find(chat => chat.ChatId === chatId);
                if (chat) {
                    dispatch(setPersonalChats(personalChats?.filter(chat => chat.ChatId !== chatId) || []));
                } else {
                    chat = pinnedChats?.find(chat => chat.ChatId === chatId);
                    if (chat) {
                        dispatch(setPinnedChats(pinnedChats?.filter(chat => chat.ChatId !== chatId) || []));
                    }
                }
            }
            console.log(chat)
            if (chat) {
                dispatch(setArchiveChats(archiveChats ? [...archiveChats, chat] : [chat]));
            }

            dispatch(setSuccess(res.message));
        } else {
            dispatch(setError(res.message));
        }
        setLoading(false);
    };

    const unArchiveChat = async () => {
        setLoading(true);
        const res = await unArchiveChatApi({ chatId });
        if (res.success) {
            let chat = archiveChats?.find(chat => chat.ChatId === chatId);
            if (chat) {
                dispatch(setArchiveChats(archiveChats?.filter(chat => chat.ChatId !== chatId) || []));

                // Add the chat back to the relevant chat list based on type
                if (chatType === 'group') {
                    dispatch(setGroupChats(groupChats ? [...groupChats, chat] : [chat]));
                } else {
                    dispatch(setPersonalChats(personalChats ? [...personalChats, chat] : [chat]));
                }
            }

            dispatch(setSuccess(res.message));
        } else {
            dispatch(setError(res.message));
        }
        setLoading(false);
    };

    const isArchived = useMemo(() => {
        return archiveChats?.some((archiveChat) => archiveChat.ChatId === chatId);
    }, [archiveChats, chatId]);

    return {
        archiveChat,
        unArchiveChat,
        isArchived,
    };
}
