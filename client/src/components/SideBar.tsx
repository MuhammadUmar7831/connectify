import { SiGooglegemini } from "react-icons/si";
// import { VscDebugDisconnect } from "react-icons/vsc";
import UserIcon from "../interface/icons/UserIcon";

export default function SideBar() {
  return (
    <div className="bg-black h-full w-20 rounded-2xl flex flex-col items-center justify-between py-6">
      <SiGooglegemini color="#FF4D0C" className="w-7 h-7" />
      <div>
        {/* other icons */}
      </div>
      <UserIcon className={'text-white p-3 rounded-full bg-slate-500 h-10 w-10 cursor-pointer'} />
    </div>
  )
}
