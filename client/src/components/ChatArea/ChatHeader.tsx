import { useContext, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Avatar from "../../interface/Avatar";
import { BsThreeDots } from "react-icons/bs";
import { getSocket } from "../../config/scoket.config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import ChatHeaderResponse from "../../types/chatHeaderReponse.type";
import formatTimestamp from "../../utils/messageTimeFormater";
import useActive from "../../hooks/useActive";
import { MessageInfoContext } from "../context/MessageInfoContext";

interface Props {
    data: ChatHeaderResponse | null;
}

export default function ChatHeader({ data }: Props) {
    const { user } = useSelector((state: RootState) => state.user);
    const { chatId } = useParams<{ chatId: string }>();
    const { setShowInfoPanel } = useContext(MessageInfoContext)!
    const [status, setStatus] = useState<string>('');
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const userId = data?.Type === 'Personal' ?
        data?.Members[0].IsActivePrivacy === 0 ?
            data?.Members[0].UserId :
            null :
        null;

    const active = useActive(userId);
    const socket = getSocket();

    const setOriginalStatus = () => {
        if (data?.Type === 'Group') {
            const memberNames: string = data?.Members
                .map(member => member.Name)
                .join(', ');
            setStatus(['You', memberNames].join(', '));
        } else {
            if (data?.Members[0].IsLastSeenPrivacy === 0) {
                let LastSeen: null | undefined | string = data.Members[0].LastSeen;
                LastSeen = formatTimestamp(LastSeen);
                if (LastSeen) {
                    setStatus(`Last seen on ${LastSeen}`);
                }
            }
        }
    };

    useEffect(() => {
        setOriginalStatus();
    }, [data]);

    useEffect(() => {
        setShowInfoPanel(false)
    }, [chatId])

    const handleUserTyping = (userId: number, userName: string, _chatId: string) => {
        if (user?.UserId != userId && chatId === _chatId) {
            setStatus(`${userName} is Typing...`);

            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            const timeout = window.setTimeout(() => {
                if (active) {
                    setStatus('Active');
                } else {
                    setOriginalStatus(); // set the original status of chat
                }
                setTypingTimeout(null); // Reset timeout state
            }, 1000);

            setTypingTimeout(timeout);
        }
    };

    useEffect(() => {
        if (data?.Type === 'Personal' && active) {
            setStatus('Active');
        } else {
            setOriginalStatus();
        }
    }, [active, data]);

    useEffect(() => {
        if (socket && chatId) {
            socket.on('userTyping', handleUserTyping);

            return () => {
                socket.off('userTyping', handleUserTyping);
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }
            };
        }
    }, [socket, chatId, user, typingTimeout]);

    return (
        <div className="bg-white rounded-2xl w-full p-4 flex justify-between items-center">
            <div className="flex gap-4">
                <Avatar
                    image={data !== null ? data.ChatAvatar : ''}
                    isActive={active}
                    className="w-12 h-14" />
                <div>
                    <h1 className="text-xl font-semibold">{data?.ChatName}</h1>
                    <span className={`text-sm ${typingTimeout !== null ? 'text-orange' : status === 'Active' ? 'text-green-500' : 'text-gray-200'}`}>{status}</span>
                </div>
            </div>
            <div className="flex items-center gap-4 justify-between">
                <div className="pr-2 border-r border-gray">
                    <Link to={`/info/${data?.Type}/${data?.InfoId}`} className={`rounded-3xl border border-black hover:bg-black hover:text-white cursor-pointer py-2 px-4`}>
                        <span className="font-semibold">Profile</span>
                    </Link>
                </div>
                <div className="flex gap-2">
                    <CiSearch className="text-black text-2xl cursor-pointer" />
                    <BsThreeDots className="text-black text-2xl cursor-pointer" />
                </div>
            </div>
        </div>
    );
}
