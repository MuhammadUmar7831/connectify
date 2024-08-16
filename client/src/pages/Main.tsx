import ChatList from "../components/Main/ChatList";
import MainHeader from "../components/Main/MainHeader";
import SideBar from "../components/SideBar";
import useScreenWidth from "../hooks/useScreenWidth";

export default function Main() {
    const screenWidth = useScreenWidth();
    if (screenWidth && screenWidth < 1024) {
        return (
            <div className="w-full h-full flex flex-col gap-2 mx-auto">
                <MainHeader />
                <ChatList />
                <SideBar />
            </div>
        );
    }

    return (
        <div className="w-1/2 max-w-[500px] 2xl:w-1/3 h-full flex gap-2">
            <SideBar />
            <div className="h-full w-full flex flex-col gap-2 min-w-[400px]">
                <MainHeader />
                <ChatList />
            </div>
        </div>
    )
}
