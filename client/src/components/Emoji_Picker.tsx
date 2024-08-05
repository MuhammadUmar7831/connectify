import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react'
import { BsEmojiGrin } from 'react-icons/bs'

export default function Emoji_Picker({ emojiPicketClassName, onPickup }: { emojiPicketClassName?: string, onPickup: (emoji: string) => void }) {
    const [isOpen, setOpen] = useState<boolean>(false);
    return (
        <div>
            <BsEmojiGrin className="cursor-pointer" size={25} onClick={() => setOpen(!isOpen)} />
            <div
                className={`absolute ${emojiPicketClassName}`}>
                <EmojiPicker open={isOpen} height={350} onEmojiClick={(emojiData: EmojiClickData) => { onPickup(emojiData.emoji) }} />
            </div>
        </div>
    )
}
