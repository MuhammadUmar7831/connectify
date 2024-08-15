import { motion } from "framer-motion"

interface SwitchesProps {
    title: string,
    isChecked: boolean,
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Switches = ({ title, isChecked, setIsChecked }: SwitchesProps) => {
    const handleChange = () => {
        setIsChecked(!isChecked);
    };
    return (
        <>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={handleChange}
                />
                <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${isChecked ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                <motion.div
                    whileTap={{ width: !isChecked ? "35px" : "16px" }}
                    className={` border-2  border-black absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform ${isChecked ? ' translate-x-5' : ''}`}></motion.div><div
                        className={` absolute  left-1 top-1 bg-white rounded-full transition-transform duration-300 transform ${isChecked ? 'translate-x-5' : ''}`}>
                </div>

            </label>
        </>
    );
}
