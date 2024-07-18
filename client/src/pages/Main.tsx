import ChatList from "../components/Main/ChatList";
import MainHeader from "../components/Main/MainHeader";

export default function Main() {
    return (
        <div className="w-1/3 min-w-[380px] h-full flex flex-col gap-2">
            <MainHeader />
            <ChatList />
        </div>
    )
}
