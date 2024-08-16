import CircleAlert from "../../interface/CircleAlert";
import Clock from "../../interface/Clock";
import DoubleTick from "../../interface/DoubleTick";
import SingleTick from "../../interface/SingleTick";
import { IoIosArrowDown } from "react-icons/io";
import getMessageStatus from "../../utils/getMessageStatus";
import { HiOutlineReply } from "react-icons/hi";
import MessageContextMenu from "./MessageContextMenu";
import { useMenu } from "../../hooks/useMenu";
import themeColor from "../../config/theme.config";
import { useContext, useState } from "react";
import { MessageInfoContext } from "../../context/MessageInfoContext";

interface Props {
  me: Boolean;
  message: string;
  content: string;
  time: string;
  senderId: number;
  senderName: string;
  replySenderId: number | null;
  replySender: string | null;
  onSetReplyClick: any;
  messageId: number;
  userStatus: {
    Status: string;
    UserId: number;
    UserName: string;
  }[];
}

export default function MessageReply(props: Props) {
  const { me, message, content, time, userStatus, senderName, senderId, replySender, messageId, onSetReplyClick } = props;

  const status = getMessageStatus(userStatus);
  const { showMenu, setShowMenu, menuRef } = useMenu();
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const { setShowInfoPanel, setUserStatus, setSelectedMessage, setTimestamp } = useContext(MessageInfoContext)!;

  const handleMenuClick = (e: SVGElement) => {
    const rect = e.getBoundingClientRect();
    let menuWidth = 0;
    if (me) {
      menuWidth = 70
    }
    setMenuPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX - menuWidth,
    });
    setShowMenu(!showMenu);
  };

  const handleInfoClick = () => {
    setShowMenu(false);
    setShowInfoPanel(true);
    setUserStatus(userStatus);
    setSelectedMessage(content);
    setTimestamp(time)
  }


  return (
    <div className={`flex gap-2 ${me ? 'justify-end' : 'justify-start'}`}>
      <div className={`group flex items-center gap-2 ${me ? "" : "flex-row-reverse"}`}>
        <HiOutlineReply
          onClick={() => {
            onSetReplyClick(messageId, content, senderId, senderName);
          }}
          size={20}
          className={`cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${me ? '' : 'scale-x-[-1]'}`} /> {/*scale-x-[-1] will flip horizintally the reply icon */}
        <div className={`flex flex-col gap-2 ${me ? 'items-end' : ''}`}>
          <span
            className={`text-xs font-semibold hover:underline cursor-pointer ${me ? " text-orange text-end" : "text-black"
              }`}
          >
            {me ? "You" : senderName}
          </span>
          <div
            ref={menuRef}
            className={`${me
              ? "bg-orange rounded-l-2xl text-white"
              : "bg-gray-200 rounded-r-2xl text-black"
              } rounded-t-2xl p-4 text-sm relative group`}
          >
            <MessageContextMenu isOpen={showMenu} options={['Info', 'Edit', 'Delete']} actions={[
              handleInfoClick,
              () => { /* Edit logic */ },
              () => { /* Delete logic */ }
            ]} position={menuPosition} />
            <IoIosArrowDown
              onClick={(e: React.MouseEvent<SVGElement, MouseEvent>) => handleMenuClick(e.currentTarget)}
              style={{ boxShadow: `0 0 6px 6px ${me ? themeColor : '#BABABA'}` }}
              className={`absolute top-2 right-4 z-10 ${me ? 'bg-orange' : 'bg-gray-200'} text-lg rounded-full opacity-0 group-hover:opacity-100 cursor-pointer`}
            />

            <div
              className={`${me ? "bg-orange-100" : " bg-gray-100"
                }  py-2 px-4 mb-2 rounded-md opacity-75`}
            >
              <p className={`font-semibold`}>{replySender}</p>
              {message}
            </div>
            <p className="text-white max-w-[200px] sm:max-w-[400px] text-wrap">{content}</p>
          </div>
          <div className={`flex gap-2 ${me ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-gray-200 text-xs">{time}</span>
            {me &&
              (status === "sending" ? (
                <Clock size="16" className="text-gray-200" />
              ) : status === "error" ? (
                <CircleAlert size="16" className="text-red-700" />
              ) : status === "sent" ? (
                <SingleTick size="16" className="text-gray-200" />
              ) : status === "received" ? (
                <DoubleTick size="16" className="text-gray-200" />
              ) : (
                <DoubleTick size="16" className="text-orange" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
