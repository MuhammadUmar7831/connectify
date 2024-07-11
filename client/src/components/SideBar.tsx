import { SiGooglegemini } from "react-icons/si";
import { HiOutlineMail } from "react-icons/hi";
import { IoMdChatboxes } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
// import { VscDebugDisconnect } from "react-icons/vsc";
import UserIcon from "../interface/icons/UserIcon";

export default function SideBar() {
  return (
    <div className="bg-black h-full w-20 rounded-2xl flex flex-col items-center justify-between py-6">
      <SiGooglegemini color="#FF4D0C" className="w-7 h-7" />
      <div>
        {
          <ul className="flex flex-col justify-between h-48 mb-12">
            <li>
              {" "}
              <HiOutlineMail className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />
            </li>
            <li>
              {" "}
              <IoMdChatboxes className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />
            </li>
            <li>
              {" "}
              <MdNotificationsNone className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />
            </li>
            <li>
              {" "}
              <RiDeleteBinLine className="w-5 h-5 cursor-pointer text-white hover:text-orange focus:text-orange" />
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
