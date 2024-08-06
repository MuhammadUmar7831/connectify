import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setGroupChats } from '../redux/slices/groupChats';
import { setPersonalChats } from '../redux/slices/personalChats';
import { setPinnedChats } from '../redux/slices/pinnedChats';
import { pinChatApi, unPinChatApi } from '../api/chat.api';
import Chat from '../types/chat.types';
import { setError } from '../redux/slices/error';
import { setSuccess } from '../redux/slices/success';

type ChatType = 'group' | 'personal';

interface UsePiningChatProps {
    chatId: number;
    chatType: ChatType;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function usePiningChat({ chatId, chatType, setLoading }: UsePiningChatProps) {
    const dispatch = useDispatch();
    const { groupChats } = useSelector((state: RootState) => state.groupChats);
    const { personalChats } = useSelector((state: RootState) => state.personalChats); // Personal chats from state
    const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);

    const pinChat = async () => {
        setLoading(true);
        const res = await pinChatApi({ chatId });
        if (res.success) {
            let chat: Chat | undefined;

            // Find the chat in the relevant chat list based on type
            if (chatType === 'group') {
                chat = groupChats?.find(chat => chat.ChatId === chatId);
                dispatch(setGroupChats(groupChats?.filter(chat => chat.ChatId !== chatId) || []));
            }
            else {
                chat = personalChats?.find(chat => chat.ChatId === chatId);
                dispatch(setPersonalChats(personalChats?.filter(chat => chat.ChatId !== chatId) || []));
            }

            if (chat) {
                dispatch(setPinnedChats(pinnedChats ? [...pinnedChats, chat] : [chat]));
            }
            dispatch(setSuccess(res.message));
        } else {
            dispatch(setError(res.message));
        }
        setLoading(false);
    };

    const unPinChat = async () => {
        setLoading(true);
        const res = await unPinChatApi({ chatId });
        if (res.success) {
            let chat = pinnedChats?.find(chat => chat.ChatId === chatId);
            if (chat) {
                dispatch(setPinnedChats(pinnedChats?.filter(chat => chat.ChatId !== chatId) || []));

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

    const isPinned = useMemo(() => {
        return pinnedChats?.some((pinnedChat) => pinnedChat.ChatId === chatId);
    }, [pinnedChats, chatId]);

    return {
        pinChat,
        unPinChat,
        isPinned,
    };
}
