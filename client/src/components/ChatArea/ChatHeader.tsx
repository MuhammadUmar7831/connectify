import { CiSearch } from "react-icons/ci";
import Avatar from "../../interface/Avatar";
import HeaderButton from "./HeaderButton";
import { BsThreeDots } from "react-icons/bs";

export default function ChatHeader() {
    return (
        <div className="bg-white rounded-2xl w-full p-4 flex justify-between items-center">
            <div className="flex gap-4">
                <Avatar
                    image={'https://media.licdn.com/dms/image/D5603AQEx_fCrarjrTA/profile-displayphoto-shrink_200_200/0/1693693804377?e=2147483647&v=beta&t=J6fPaqXI7IiFVUerxsAOL3zmcQmrEmHwBpzUjh51Vy4'}
                    isActive={true}
                    className="w-12" />
                <div>
                    <h1 className="text-xl font-semibold">OK Yarism</h1>
                    <span className="text-sm text-gray-200">Online</span>
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
        </div >
    )
}
