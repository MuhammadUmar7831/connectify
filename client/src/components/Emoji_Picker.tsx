import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react'
import { BsEmojiGrin } from 'react-icons/bs'
import { RxCross1 } from "react-icons/rx";

export default function Emoji_Picker({ emojiPicketClassName, closeOnPickup = true, onPickup }: { emojiPicketClassName?: string, closeOnPickup?: boolean, onPickup: (emoji: string) => void }) {
    const [isOpen, setOpen] = useState<boolean>(false);

    return (
        <div>
            {isOpen ?
                <RxCross1 className="cursor-pointer" size={25} onClick={() => setOpen(false)} /> :
                <BsEmojiGrin className="cursor-pointer" size={25} onClick={() => setOpen(true)} />
            }
            <div
                className={`absolute ${emojiPicketClassName}`}>
                <EmojiPicker open={isOpen} width={300} height={350} onEmojiClick={(emojiData: EmojiClickData) => { setOpen(!closeOnPickup); onPickup(emojiData.emoji) }} />
            </div>
        </div>
    )
}
