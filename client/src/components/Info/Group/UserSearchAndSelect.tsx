import { useEffect, useRef, useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { MdArrowForward } from "react-icons/md";
import { motion } from "framer-motion";
import { searchApi } from "../../../api/user.api";
import { useDispatch } from "react-redux";
import { setError } from "../../../redux/slices/error";

export interface User {
    UserId: number;
    Name: string;
    Avatar: string;
    Bio: string;
}

export default function UserSearchAndSelect({ notInclude, onClose, proceed }: { notInclude: number[], onClose: () => void, proceed: (params?: any) => void }) {
    const [query, setQuery] = useState<string>("");
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const abortControllerRef = useRef<AbortController | null>(null);

    const search = async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const res = await searchApi({ query, notInclude });
        if (res.success) {
            setSearchResult(res.data);
        } else {
            dispatch(setError(res.message));
        }
    };

    useEffect(() => {
        search();
    }, [query]);

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<span class='text-orange'>$1</span>");
    };

    const selectUser = (userId: number) => {
        notInclude.push(userId);
        setSelectedUsers((prevSelectedUsers) => [
            ...prevSelectedUsers,
            searchResult.find(user => user.UserId === userId)!
        ]);
        setSearchResult((prevSearchResult) =>
            prevSearchResult.filter(user => user.UserId !== userId)
        );
    }

    const deSelectUser = (userId: number) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.filter(user => user.UserId !== userId)
        );
        notInclude.splice(notInclude.indexOf(userId), 1);
    }

    const handleProceed = async (selectedUsers: User[]) => {
        setLoading(true)
        await proceed(selectedUsers);
        setLoading(false)

    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar bg-white rounded-2xl pt-4">
            <div className="w-fit px-4 cursor-pointer">
                <IoReturnUpBack size={30} onClick={() => { onClose() }} />
            </div>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                        },
                    },
                }}
                className="px-4 flex gap-5">
                {selectedUsers.map((selectedUser) => (
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        key={selectedUser.UserId} className="relative w-fit">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img className="object-contain" src={selectedUser.Avatar} alt={selectedUser.Name} />
                        </div>
                        <div onClick={() => deSelectUser(selectedUser.UserId)} className="w-fit bg-white rounded-full absolute bottom-0 right-0 cursor-pointer">
                            <IoIosCloseCircle size={20} className="text-gray-300" />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-2">
                <h1 className="text-lg px-4">Search User Here</h1>
                <form className="px-4" onSubmit={(e) => { e.preventDefault(); search(); }}>
                    <input
                        required
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-xl border p-2 focus:outline-none"
                        type="text"
                        placeholder="Search"
                    />
                </form>
                <div className="flex flex-col gap-2 overflow-y-scroll no-scrollbar pb-4">
                    {searchResult.map((user) => (
                        <div key={user.UserId} onClick={() => selectUser(user.UserId)} className="w-full flex gap-2 hover:bg-gray-100 py-2 px-4 cursor-default">
                            <div className="rounded-full overflow-hidden h-16 w-16">
                                <img className="object-contain" src={user.Avatar} alt={user.Name} />
                            </div>
                            <div className="flex flex-col">
                                <h1
                                    className="text-lg font-semibold"
                                    dangerouslySetInnerHTML={{ __html: highlightText(user.Name, query) }}
                                />
                                <p dangerouslySetInnerHTML={{ __html: highlightText(user.Bio, query) }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedUsers.length > 0 ?
                loading ?
                    <div
                        className="fixed bottom-[50px] right-[50px] w-fit p-4 rounded-full bg-orange cursor-pointer group animate-pulse">
                        <MdArrowForward size={30} className="text-white" />
                    </div>
                    :
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-[50px] right-[50px] w-fit p-4 rounded-full border border-orange bg-orange hover:bg-white cursor-pointer group"
                        onClick={() => handleProceed(selectedUsers)}>
                        <MdArrowForward size={30} className="text-white group-hover:text-orange" />
                    </motion.div> : <></>
            }
        </motion.div>
    );
}
