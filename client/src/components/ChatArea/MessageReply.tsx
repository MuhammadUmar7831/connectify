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
import MessageResponse from "../../types/MessageResponse.type";
import EditMessageModal from "./EditMessageModal";

interface Props {
  me: Boolean;
  onSetReplyClick: any;
  message: MessageResponse;
  editMessage: (any: any) => any;
}

function formatTime(timestamp: string): string {
  if (timestamp === "") {
    return timestamp;
  }
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutesStr + " " + ampm;
  return strTime;
}

export default function MessageReply(props: Props) {
  const { me, onSetReplyClick, message, editMessage } = props;
  const { ReplyContent, Timestamp, UserStatus, Sender, SenderId, ReplySender, MessageId } = message;
  const [content, setContent] = useState<string>(message.Content);
  const [editedMessage, setEditedMessage] = useState<string | null>(null);
  const [isEdited, setIsEdited] = useState<null | undefined | boolean>(message.isEdited)

  const status = getMessageStatus(UserStatus);
  const { showMenu, setShowMenu, menuRef } = useMenu();
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const { setShowInfoPanel, setUserStatus, setSelectedMessage, setTimestamp } = useContext(MessageInfoContext)!;
  const formatedTime = formatTime(Timestamp);

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
    setUserStatus(UserStatus);
    setSelectedMessage(content);
    setTimestamp(formatedTime)
  }

  const handleEditClick = async () => {
    if (content === editedMessage) return;
    setEditedMessage(null);// close popup (not close if same message)
    setIsEdited(false) //means api is taking time
    setContent(editedMessage === null ? content : editedMessage);
    const success = await editMessage({ MessageId, Content: editedMessage });
    if (!success) {
      setContent(message.Content)
      setIsEdited(null); // null means error editing
    } else {
      setIsEdited(true)
    }
  }

  return (
    <div className={`flex gap-2 ${me ? 'justify-end' : 'justify-start'}`}>
      <div className={`group flex items-center gap-2 ${me ? "" : "flex-row-reverse"}`}>
        <HiOutlineReply
          onClick={() => {
            onSetReplyClick(MessageId, content, SenderId, Sender);
          }}
          size={20}
          className={`cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${me ? '' : 'scale-x-[-1]'}`} /> {/*scale-x-[-1] will flip horizintally the reply icon */}
        <div className={`flex flex-col gap-2 ${me ? 'items-end' : ''}`}>
          <span
            className={`text-xs font-semibold hover:underline cursor-pointer ${me ? " text-orange text-end" : "text-black"
              }`}
          >
            {me ? "You" : Sender}
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
              () => { /* Edit Logic */
                setEditedMessage(content);// mean edit modal is now active
              },
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
              <p className={`font-semibold`}>{ReplySender}</p>
              {ReplyContent}
            </div>
            <p className="text-white max-w-[200px] sm:max-w-[400px] text-wrap">{content}</p>
          </div>
          <div className={`flex gap-2 ${me ? 'flex-row-reverse' : 'flex-row'}`}>
            {isEdited === undefined ?
              <></>
              : isEdited === null ? <span className="text-gray-200 text-xs font-semibold flex gap-1"><CircleAlert size="16" className="text-red-700" />Error Editing</span>
                : isEdited === false ? <span className="text-gray-200 text-xs font-semibold flex gap-1"><Clock size="16" className="text-gray-200" />Editing</span>
                  : <span className="text-gray-200 text-xs font-semibold">Edited</span>
            }
            {formatedTime !== "" && <span className="text-gray-200 text-xs">{formatedTime}</span>}
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
      {editedMessage !== null &&
        <EditMessageModal
          submitEditMessage={handleEditClick}
          content={editedMessage}
          setContent={setEditedMessage}
        />
      }
    </div>
  );
}
