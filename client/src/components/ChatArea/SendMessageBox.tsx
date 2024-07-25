import { IoSend } from "react-icons/io5";
import { BsEmojiGrin } from "react-icons/bs";
import { useParams } from "react-router-dom";

export default function SendMessageBox(props: any) {
  const { onContentChange, onSendMessageIconClick, Content } = props;
  const { chatId } = useParams();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (Content !== "") {
          onSendMessageIconClick(chatId);
        }
      }}
      className="flex gap-2 items-center rounded-2xl bg-white w-full p-4"
    >
      <BsEmojiGrin className="text-orange text-2xl cursor-pointer" />
      <input
        autoComplete="off"
        onChange={onContentChange}
        value={Content}
        placeholder="Type a message"
        type="text"
        name="Content"
        id="Content"
        className="p-2 w-full outline-none  rounded-md"
      />
      <button title="send button" type="submit">
        <IoSend className="text-orange text-2xl cursor-pointer" />
      </button>
    </form>
  );
}
