import { useContext } from 'react';
import { RxCrossCircled } from "react-icons/rx";
import CircleAlert from "../../interface/CircleAlert";
import DoubleTick from "../../interface/DoubleTick";
import SingleTick from "../../interface/SingleTick";
import { MessageInfoContext } from '../../context/MessageInfoContext';
import { motion } from "framer-motion";

export default function MessageInfoPanel() {

    const { userStatus, showInfoPanel, setShowInfoPanel, selectedMessage, timestamp } = useContext(MessageInfoContext)!;

    if (!showInfoPanel) return <></>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full bg-white absolute top-0 left-0 rounded-2xl flex flex-col items-end z-10">
            <div className="w-full p-4">
                <RxCrossCircled size={30} className="cursor-pointer hover:text-orange" onClick={() => setShowInfoPanel(false)} />
            </div>
            <div className="flex flex-col gap-2 w-fit p-4">
                <span className="text-xs font-semibold hover:underline cursor-pointer text-orange">
                    You
                </span>
                <div className="bg-orange rounded-t-2xl rounded-bl-2xl p-4 text-white">
                    {selectedMessage}
                </div>
                <span className="text-xs text-end font-semibold cursor-pointer text-black">
                    {timestamp}
                </span>
            </div>
            <div className="w-full bg-white">
                <h1 className="text-lg font-semibold my-2 px-4">User{userStatus.length > 0 ? 's' : ''} Status</h1>
                {userStatus.map((user, index) => (
                    <div key={index} className="flex justify-between hover:bg-gray-100 px-4 py-2 items-center">
                        <h2 className="text-lg">{user.UserName}</h2>
                        {user.Status === "sent" ? (
                            <SingleTick size="20" className="text-gray-200" />
                        ) : user.Status === "received" ? (
                            <DoubleTick size="20" className="text-gray-200" />
                        ) : user.Status === "seen" ? (
                            <DoubleTick size="20" className="text-orange" />
                        ) : (
                            <CircleAlert size="16" className="text-red-700" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
