import DoubleTick from "../../interface/DoubleTick";
import SingleTick from "../../interface/SingleTick";
import { IoIosArrowDown } from "react-icons/io";

export default function Message({ me, content, time, status, senderName }: { me: Boolean, content: String, time: String, status: String, senderName: String }) {
  return (
    <div className={`flex flex-col gap-2 ${me ? 'items-end' : 'items-start'}`}>
      <span className="text-xs font-semibold text-orange hover:underline cursor-pointer">{me ? 'You' : senderName}</span>
      <div className={`${me ? 'bg-orange rounded-l-2xl text-white' : 'bg-gray-100 rounded-r-2xl text-black'} rounded-t-2xl p-4 text-sm relative group`}>
        <IoIosArrowDown className="absolute top-2 right-4 text-lg opacity-0 group-hover:opacity-100 cursor-pointer" />
        <p>{content}</p>
      </div>
      <div className="flex gap-2">
        <span className="text-gray-200 text-xs">{time}</span>
        {
          me && (
            status === 'sent' ?
              <SingleTick size="16" className="text-gray-200" /> :
              status == 'received' ?
                <DoubleTick size="16" className="text-gray-200" /> :
                <DoubleTick size="16" className="text-orange" />
          )
        }
      </div>
    </div >
  )
}