import { ChangeEvent } from "react";
import Overlay from "../../interface/Overlay";
import Emoji_Picker from "../Emoji_Picker";
import { IoSend } from "react-icons/io5";

interface PropsInterface {
    submitEditMessage: () => void,
    content: string | null,
    setContent: React.Dispatch<React.SetStateAction<string | null>>
}

export default function EditMessageModal({ submitEditMessage, content, setContent }: PropsInterface) {
    return (
        <Overlay onClose={() => { setContent(null) }} className="z-10 flex flex-col gap-2 items-center justify-center p-4">
            <div onClick={(e) => { e.stopPropagation() }} className="bg-white max-w-[500px] w-full rounded-2xl px-4 py-2">
                {content}
            </div>
            <form onClick={(e) => { e.stopPropagation() }}
                onSubmit={(e) => { e.preventDefault(); submitEditMessage(); }}
                className="relative flex gap-2 items-center bg-white max-w-[500px] w-full rounded-2xl px-4 py-2"
            >
                <Emoji_Picker emojiPicketClassName="-top-[350px] left-0" onPickup={(emoji: string) => { setContent(`${content}${emoji}`) }} />
                <input
                    autoComplete="off"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setContent(e.target.value) }}
                    value={content === null ? '' : content}
                    placeholder="Type a message"
                    id="sendMessageInput"
                    type="text"
                    name="Content"
                    required
                    className="p-2 w-full outline-none  rounded-md"
                />
                <button title="send button" type="submit">
                    <IoSend className="text-orange text-2xl cursor-pointer" />
                </button>
            </form>
        </Overlay>
    )
}
