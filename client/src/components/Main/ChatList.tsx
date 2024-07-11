import ChatListItem from "./ChatListItem";

export default function ChatList() {
    return (
        <div className="rounded-2xl w-full bg-white overflow-y-scroll no-scrollbar">
            <h1 className="text-gray-200 mx-6 mt-6 uppercase text-sm">Pinned</h1>
            <ChatListItem image="https://xsgames.co/randomusers/assets/avatars/male/10.jpg" name="Lyndon Noguchi" lastMessage="Have a Good day, Lyndon!" lastMessageTime="10:27 AM" notification={1} />
            <ChatListItem image="https://xsgames.co/randomusers/assets/avatars/male/41.jpg" name="Mary Knoeck" lastMessage="Hi! Good to Hear from you. it's been a long day" lastMessageTime="9:48 AM" />
            <ChatListItem image="https://xsgames.co/randomusers/assets/avatars/male/42.jpg" name="Wilfredo Parla" lastMessage="Wow, That Looks Amazing" lastMessageTime="10:32 AM" isActive={true} />
            <h1 className="text-gray-200 mx-6 mt-6 uppercase text-sm">Personal</h1>
            <ChatListItem image="https://xsgames.co/randomusers/assets/avatars/male/59.jpg" name="Daron Danier" lastMessage="Hey There i am having trouble with opening chrome" lastMessageTime="11:24 AM" notification={3} />
            <ChatListItem image="https://xsgames.co/randomusers/assets/avatars/male/64.jpg" name="Colombus Lopex" lastMessage="I'm ready to buy this thing but i have no money right now" lastMessageTime="9:48 AM" isActive={true} />
            <ChatListItem image="https://xsgames.co/randomusers/assets/avatars/male/75.jpg" name="Jonah Morter" lastMessage="Hi my order is not archived yet" lastMessageTime="9:20 AM" notification={2} />
        </div>
    )
}
