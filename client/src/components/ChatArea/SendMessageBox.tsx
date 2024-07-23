import { IoSend } from "react-icons/io5";
import { BsEmojiGrin } from "react-icons/bs";

export default function SendMessageBox() {
    return (
        <div className='flex gap-2 items-center rounded-2xl bg-white w-full p-4'>
            <BsEmojiGrin className="text-orange text-2xl cursor-pointer" />
            <input type="text" name="message" id="message" className="p-2 w-full outline-none bg-gray-100 focus:bg-gray-200 rounded-md" />
            <IoSend className="text-orange text-2xl cursor-pointer" />
        </div>
    )
}
