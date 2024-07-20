import Message from "./Message";

export default function ChatSection() {
    return (
        <div className="bg-white rounded-2xl w-full h-full flex flex-col gap-10 p-4 overflow-y-scroll no-scrollbar">
            <Message me={true} content="Hello! OK Yarism" time="5:19 PM" status="seen" senderName="Muhammad Umar" />
            <Message me={false} content="Kam az Kam 30 saal ka time de" time="7:28 PM" status="seen" senderName="Rabi ud Din" />
            <Message me={true} content="Ye Babu Rao ka style he" time="9:45 PM" status="received" senderName="Muhammad Umar" />
            <Message me={false} content="Mast Plan He" time="10:50 PM" status="received" senderName="Muhammad Khizar" />
            <Message me={false} content="Mu Se Supari Nikal ke Baat Kar" time="10:55 PM" status="sent" senderName="Huzaifa Rizwan" />
        </div>
    )
}
