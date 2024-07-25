import CircleAlert from "../../interface/CircleAlert";
import Clock from "../../interface/Clock";
import DoubleTick from "../../interface/DoubleTick";
import SingleTick from "../../interface/SingleTick";
import { IoIosArrowDown } from "react-icons/io";

export default function Message({
  me,
  content,
  time,
  status,
  senderName,
}: {
  me: Boolean;
  content: String;
  time: String;
  status: String;
  senderName: String;
}) {
  return (
    <div className={`flex flex-col gap-2 ${me ? "items-end" : "items-start"}`}>
      <span
        className={`text-xs font-semibold hover:underline cursor-pointer ${
          me ? " text-orange" : "text-black"
        }`}
      >
        {me ? "You" : senderName}
      </span>
      <div
        className={`${
          me
            ? "bg-orange rounded-l-2xl text-white"
            : "bg-gray-200 rounded-r-2xl text-black"
        } rounded-t-2xl p-4 text-sm relative group`}
      >
        <IoIosArrowDown className="absolute top-2 right-4 text-lg opacity-0 group-hover:opacity-100 cursor-pointer" />
        <p className=" text-white">{content}</p>
      </div>
      <div className="flex gap-2">
        {time !== "" && <span className="text-gray-200 text-xs">{time}</span>}
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
            <DoubleTick size="16" className="text-blue-700" />
          ))}
      </div>
    </div>
  );
}
