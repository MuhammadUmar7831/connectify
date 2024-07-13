import { GrConnect } from "react-icons/gr";
import { HiMiniUserGroup } from "react-icons/hi2";
import ArchiveIcon from "../interface/icons/ArchiveIcon";
import ChatIcon from "../interface/icons/ChatIcon";
// import { VscDebugDisconnect } from "react-icons/vsc";
import UserIcon from "../interface/icons/UserIcon";

export default function SideBar() {
  return (
    <div className="bg-black h-full w-20 rounded-2xl flex flex-col items-center justify-between py-6 min-w-20">
      <GrConnect className="w-7 h-7 text-orange hover:text-white cursor-pointer" />
      <div>
        {
          <ul className="flex flex-col justify-between h-36 mb-12">
            <li>
              <ChatIcon className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />
            </li>
            <li>
              <HiMiniUserGroup className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />
            </li>
            <li>
              <ArchiveIcon className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />
            </li>
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
