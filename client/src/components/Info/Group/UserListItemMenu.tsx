
import { motion } from "framer-motion";
interface Props {
    isOpen: Boolean;
    options: string[];
    actions: (() => void)[];
}

export default function UserListItemMenu({ isOpen, options, actions }: Props) {
    if (!isOpen) {
        return <></>
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: '-80%', y: '-100%' }}
            animate={{ opacity: 1, x: '-80%', y: '-130%' }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg absolute top-0 left-0 py-2 shadow -translate-x-[80%] -translate-y-[130%] text-nowrap">
            <ul>
                {options.map((option, index) => (
                    <li
                        key={index}
                        className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={actions[index]}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </motion.div>

    )
}
