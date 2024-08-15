import { GrConnect } from "react-icons/gr";
import { HiMiniUserGroup } from "react-icons/hi2";
import ArchiveIcon from "../interface/icons/ArchiveIcon";
import ChatIcon from "../interface/icons/ChatIcon";
import { IoIosPerson } from "react-icons/io";
import UserIcon from "../interface/icons/UserIcon";
import { useDispatch, useSelector } from "react-redux";
import { setChatListTypeSlice } from "../redux/slices/chatListType";
import SidebarIcon from "../interface/SidebarIcon";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";

export default function SideBar() {
  const dispatch = useDispatch();
  const { archiveChats } = useSelector((state: RootState) => state.archiveChats);
  const [archiveBadge, setAtchiveBadge] = useState<number>(0);

  const getUnseenMessageCountInArchivedChats = () => {
    if (archiveChats) {
      return archiveChats.filter(chat => chat.unSeenMessages !== undefined && chat.unSeenMessages > 0).length;
    }
    return 0;
  };

  useEffect(() => {
    setAtchiveBadge(getUnseenMessageCountInArchivedChats());
  }, [archiveChats])


  return (
    <div className="bg-black lg:h-full lg:w-20 h-20 w-full rounded-2xl flex lg:flex-col items-center justify-between px-4 py-2 lg:py-6 min-w-20">
      <GrConnect className="w-7 h-7 text-orange hover:text-white cursor-pointer hidden lg:block" />
      <div className="lg:h-1/3 w-full">
        {
          <ul className="flex gap-6 items-center justify-center lg:gap-4 lg:flex-col lg:justify-between h-full">
            <SidebarIcon
              icon={<ChatIcon className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />}
              tip={'All Chats'}
              onClick={() => dispatch(setChatListTypeSlice('All'))}
            />
            <SidebarIcon
              icon={<IoIosPerson className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />}
              tip={'Personal Chats'}
              onClick={() => dispatch(setChatListTypeSlice('Personal'))}
            />
            <SidebarIcon
              icon={<HiMiniUserGroup className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />}
              tip={'Group Chats'}
              onClick={() => dispatch(setChatListTypeSlice('Group'))}
            />
            <div className="relative">
              <SidebarIcon
                icon={<ArchiveIcon className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />}
                tip={'Archived'}
                onClick={() => dispatch(setChatListTypeSlice('Archived'))}
              />
              {
                archiveBadge > 0 &&
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange border border-black" />
              }
            </div>
          </ul>
        }
      </div>
      <UserIcon
        className={
          "text-white p-3 rounded-full bg-slate-500 h-10 w-10 cursor-pointer"
        }
      />
    </div>
  );
}
