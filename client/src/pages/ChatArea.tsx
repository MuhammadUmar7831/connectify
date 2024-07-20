import ChatHeader from "../components/ChatArea/ChatHeader";
import ChatSection from "../components/ChatArea/ChatSection";

export default function ChatArea() {

  return (
    <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2">
      <ChatHeader />
      <ChatSection />
    </div>
  )
}
