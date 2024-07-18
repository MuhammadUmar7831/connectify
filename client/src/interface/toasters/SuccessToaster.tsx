import { useDispatch, useSelector } from "react-redux";
import SuccessIcon from "../icons/SuccessIcon";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { clearSuccess } from "../../redux/slices/success";
import { motion } from "framer-motion";

export default function SuccessToaster() {
    const { success } = useSelector((state: RootState) => state.success);
    const dispatch = useDispatch();

    useEffect(() => {
        if (success) {
            const timeoutId = setTimeout(() => {
                dispatch(clearSuccess());
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [success, dispatch]);

    return (
        success && (
            <motion.div
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="flex items-center fixed bottom-2 right-2 w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                role="alert">
                <div
                    className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <SuccessIcon />
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ml-3 text-sm font-normal">{success}</div>
            </motion.div>
        )
    )
}
