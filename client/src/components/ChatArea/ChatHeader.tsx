import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Avatar from "../../interface/Avatar";
import HeaderButton from "./HeaderButton";
import { BsThreeDots } from "react-icons/bs";
import { getSocket } from "../../config/scoket.config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";

interface Props {
    userName?: string;
}

export default function ChatHeader({ userName }: Props) {
    const { user } = useSelector((state: RootState) => state.user);
    const { chatId } = useParams<{ chatId: string }>();
    const [status, setStatus] = useState<string>('You, Daniyal, Rabi, Rayyan');
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const socket = getSocket();

    useEffect(() => {
        if (socket && chatId) {
            const handleUserTyping = (userId: number, _chatId: string) => {
                if (user?.UserId != userId && chatId === _chatId) {
                    console.log(`User ${userId} is Typing...`);
                    setStatus('Typing...');

                    if (typingTimeout) {
                        clearTimeout(typingTimeout);
                    }

                    const timeout = window.setTimeout(() => {
                        setStatus('You, Daniyal, Rabi, Rayyan');
                        setTypingTimeout(null); // Reset timeout state
                    }, 2000);
                    
                    setTypingTimeout(timeout);
                }
            };

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
                    image={'https://media.licdn.com/dms/image/D5603AQEx_fCrarjrTA/profile-displayphoto-shrink_200_200/0/1693693804377?e=2147483647&v=beta&t=J6fPaqXI7IiFVUerxsAOL3zmcQmrEmHwBpzUjh51Vy4'}
                    isActive={true}
                    className="w-12" />
                <div>
                    <h1 className="text-xl font-semibold">{userName}</h1>
                    <span className={`text-sm ${typingTimeout !== null ? 'text-orange' : 'text-gray-200'}`}>{status}</span>
                </div>
            </div>
            <div className="flex items-center gap-4 justify-between">
                <div className="pr-2 border-r border-gray">
                    <HeaderButton />
                </div>
                <div className="flex gap-2">
                    <CiSearch className="text-black text-2xl cursor-pointer" />
                    <BsThreeDots className="text-black text-2xl cursor-pointer" />
                </div>
            </div>
        </div>
    );
}
