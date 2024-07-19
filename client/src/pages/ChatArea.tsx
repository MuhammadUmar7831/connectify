import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { useState } from "react";
import Message from "../components/ChatArea/Message";

export default function ChatArea() {
  const [Emoji, setEmoji] = useState(false);

  const showPicker = () => {
    setEmoji((prev) => !prev);
  };

  return (
    <div className="w-1/2 h-full flex flex-col items-start justify-start gap-2">
      <div className="flex justify-between items-center bg-white rounded-2xl px-4 py-5 w-full flex-row">
        <div className="flex flex-row gap-2 px-4 justify-between">
          <img
            src="../src/assets/react.svg"
            alt="b"
            width={50}
            height={60}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <h2 className="font-bold">Rayyan</h2>
            <span className="font-light">online</span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <button className="text-center border border-black py-2 px-4 rounded-full text-sm">
            Profile
          </button>
          <button className="text-center border border-black py-2 px-4 rounded-full bg-black text-white text-sm">
            More
          </button>
        </div>
      </div>
      <div className="bg-white w-full rounded-2xl h-full p-4 flex flex-col gap-2 justify-between items-between overflow-y-scroll no-scrollbar">
        {/* Chat content */}
        <div className="flex flex-col gap-2">
          {/* <div className="text-center text-sm text-gray-500 ">
            10 June, 2022
          </div> */}
          <Message me={true} content="Okay, it's almost ready." />
          <Message me={false} content="How about these pictures?" />
          <Message me={true} content="Looks cool, can you find more options?" />
          <Message me={false} content="Looks cool, can you find more options?" />
          <Message me={true} content="Sure, but I'm busy right now." />
          <Message me={false} content="Sure, but I'm busy left now." />
          <Message me={true} content="OK Yar" />
          <Message me={false} content="OK Yar" />
          <Message me={true} content="Sure, but I'm busy top now." />
        </div>
      </div>
      <div className="flex justify-between items-center bg-white rounded-2xl px-4 py-5 w-full flex-row">
        <div className="flex flex-row gap-2 px-4 w-full relative">
          <input
            type="text"
            className="w-full rounded-2xl px-2"
            placeholder="Write Messages . . ."
          />
          <button className="text-center py-2 px-4 rounded-full text-sm bg-orange">
            <BiSend style={{ color: "white" }} />
          </button>
          <button
            className="text-center py-2 px-4 rounded-full text-sm bg-orange"
            onClick={showPicker}
          >
            <BsEmojiSmileFill style={{ color: "white" }} />
          </button>
          {Emoji && (
            <div className="absolute bottom-16 right-0">
              <EmojiPicker />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
