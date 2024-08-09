import { createPortal } from "react-dom";
import { useRef } from "react";
import { motion } from "framer-motion";

interface MessageContextMenuProps {
    isOpen: boolean;
    options: string[];
    actions: (() => void)[];
    position: { top: number; left: number };
}

export default function MessageContextMenu({ isOpen, options, actions, position }: MessageContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0, y: '-20%' }}
            animate={{ opacity: 1, y: '0%' }}
            transition={{ duration: 0.3 }}
            ref={menuRef}
            style={{
                top: position.top - 8,
                left: position.left,
            }}
            onClick={(e) =>
                console.log(e)
            }
            id="messageMenu"
            className="absolute z-10 bg-white shadow-lg rounded-lg w-[100px]"
        >
            {options.map((option, index) => (
                <div key={index} className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={actions[index]}>
                    {option}
                </div>
            ))}
        </motion.div>,
        document.body
    );
}
