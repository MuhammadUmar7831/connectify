import { useDispatch, useSelector } from "react-redux";
import ErrorIcon from "../icons/ErrorIcon";
import { useEffect } from "react";
import { clearError } from "../../redux/slices/error";
import { RootState } from "../../redux/store";
import { motion } from "framer-motion";

export default function ErrorToaster() {
    const { error } = useSelector((state: RootState) => state.error);

    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            const timeoutId = setTimeout(() => {
                dispatch(clearError());
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [error, dispatch]);


    return (
        error && (
            <motion.div
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="flex fixed bottom-2 right-2 items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 z-20"
                role="alert">
                <div
                    className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                    <ErrorIcon />
                    <span className="sr-only">Error icon</span>
                </div>
                <div className="ml-3 text-sm font-normal">{error}</div>
            </motion.div>
        )
    )
}
