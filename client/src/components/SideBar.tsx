import { GrConnect } from "react-icons/gr";
import { HiMiniUserGroup } from "react-icons/hi2";
import ArchiveIcon from "../interface/icons/ArchiveIcon";
import ChatIcon from "../interface/icons/ChatIcon";
import { IoIosPerson } from "react-icons/io";
// import { VscDebugDisconnect } from "react-icons/vsc";
import UserIcon from "../interface/icons/UserIcon";
import { useDispatch } from "react-redux";
import { setChatListTypeSlice } from "../redux/slices/chatListType";
import SidebarIcon from "../interface/SidebarIcon";

export default function SideBar() {
  const dispatch = useDispatch();
  return (
    <div className="bg-black h-full w-20 rounded-2xl flex flex-col items-center justify-between py-6 min-w-20">
      <GrConnect className="w-7 h-7 text-orange hover:text-white cursor-pointer" />
      <div className="h-1/3">
        {
          <ul className="flex flex-col justify-between h-full">
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
            <SidebarIcon
              icon={<ArchiveIcon className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />}
              tip={'Archived'}
              onClick={() => dispatch(setChatListTypeSlice('Archived'))}
            />
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
