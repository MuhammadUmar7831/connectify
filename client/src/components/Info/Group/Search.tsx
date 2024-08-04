import { useEffect, useRef, useState } from "react";
import Overlay from "../../../interface/Overlay";
import { searchApi } from "../../../api/user.api";
import { useDispatch } from "react-redux";
import { setError } from "../../../redux/slices/error";

interface User {
    UserId: number;
    Name: string;
    Avatar: string;
    Bio: string;
}

export default function Search({ notInclude, isOpen, onClose }: { notInclude: number[], isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState<string>("");
    const [searchResult, setSearchResult] = useState<User[]>([]);
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
        if (query !== "") {
            search();
        } else {
            setSearchResult([]);
        }
    }, [query]);

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<span class='text-orange'>$1</span>");
    };

    if (!isOpen) {
        return <></>
    }

    return (
        <Overlay className="flex justify-center items-center" onClose={() => onClose()}>
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-2 w-5/6 lg:w-1/2 min-w-[280px] max-h-[300px] bg-white rounded-md py-4">
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
                <div className="flex flex-col gap-2 overflow-y-scroll no-scrollbar">
                    {searchResult.map((user) => (
                        <div key={user.UserId} className="w-full flex gap-2 hover:bg-gray-100 py-2 px-4">
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
        </Overlay>
    );
}
