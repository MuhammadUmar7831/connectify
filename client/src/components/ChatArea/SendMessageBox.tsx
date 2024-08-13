import { IoSend } from "react-icons/io5";
import ReplyMessageBox from "./ReplyMessageBox";
import { ChangeEvent, useEffect } from "react";
import Emoji_Picker from "../Emoji_Picker";

export default function SendMessageBox(props: any) {
  const {
    onContentChange,
    onSendMessageIconClick,
    Content,
    reply,
    onSetReplyClick,
  } = props;

  useEffect(() => {
    // everytime reply is changed, the message box is re-rendered
  }, [reply]);

  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-white w-full p-4">
      {/* if reply is set then this will show */}
      {reply.ReplyId && (
        <ReplyMessageBox reply={reply} onSetReplyClick={onSetReplyClick} />
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (Content !== "") {
            onSendMessageIconClick();
          }
        }}
        className="relative flex gap-2 items-center"
      >
        <Emoji_Picker emojiPicketClassName="-top-[350px] left-0" onPickup={(emoji: string) => { onContentChange(`${Content}${emoji}`) }} />
        <input
          autoComplete="off"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onContentChange(e.target.value)}
          value={Content}
          placeholder="Type a message"
          id="sendMessageInput"
          type="text"
          name="Content"
          className="p-2 w-full outline-none  rounded-md"
        />
        <button title="send button" type="submit">
          <IoSend className="text-orange text-2xl cursor-pointer" />
        </button>
      </form>
    </div>
  );
}
