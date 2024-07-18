import { CiSearch } from "react-icons/ci";

export default function Search() {
    return (
        <form onSubmit={(e) => e.preventDefault()} className="w-full rounded-3xl border border-gray py-3 px-4 flex justify-between items-center ">
            <input required type="text" placeholder="Search" className="focus:outline-none text-black w-full text-sm" />

            <button type="submit">
                <CiSearch className="text-black text-lg" />
            </button>
        </form>
    )
}
