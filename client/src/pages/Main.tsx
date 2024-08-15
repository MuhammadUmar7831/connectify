import ChatList from "../components/Main/ChatList";
import MainHeader from "../components/Main/MainHeader";
import SideBar from "../components/SideBar";
import useScreenWidth from "../hooks/useScreenWidth";

export default function Main() {
    const screenWidth = useScreenWidth();
    if (screenWidth && screenWidth < 640) {
        return (
            <div className="w-full h-full flex flex-col gap-2">
                <MainHeader />
                <ChatList />
                <SideBar />
            </div>
        );
    }

    return (
        <div className="h-full w-1/3 flex flex-col gap-2">
            <MainHeader />
            <ChatList />
        </div>
    )
}
