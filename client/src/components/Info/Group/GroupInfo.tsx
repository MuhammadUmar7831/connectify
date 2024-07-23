import { useSelector } from "react-redux";
import MembersListItems from "./MembersListItems";
import { RootState } from "../../../redux/store";

export default function GroupInfo() {
    const { user } = useSelector((state: RootState) => state.user)

    const members = [
        { UserId: 1, Name: 'Rabi ud Din', Avatar: 'https://avatars.githubusercontent.com/u/125211743?v=4', Bio: 'ربی اد دین', isAdmin: true },
        { UserId: 2, Name: 'Muhammad Umar', Avatar: 'https://avatars.githubusercontent.com/u/131664477?v=4', Bio: 'محمد عمر', isAdmin: false },
        { UserId: 3, Name: 'Daniyal Waseem', Avatar: 'https://avatars.githubusercontent.com/u/171687905?v=4', Bio: 'دانیال وسیم', isAdmin: true },
        { UserId: 4, Name: 'Rayyan Asghar', Avatar: 'https://avatars.githubusercontent.com/u/156928551?v=4', Bio: 'ریان اصغر', isAdmin: false }
    ];

    let userItselfAdmin = false;
    for (const member of members) {
        if (member.UserId === user?.UserId && member.isAdmin) {
            userItselfAdmin = true;
            break;
        }
    }

    return (
        <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
            <div className="bg-white rounded-2xl p-4">
                <div className="rounded-full overflow-hidden mx-auto w-44 h-44">
                    <img src="https://media.licdn.com/dms/image/D5603AQEx_fCrarjrTA/profile-displayphoto-shrink_200_200/0/1693693804377?e=2147483647&v=beta&t=J6fPaqXI7IiFVUerxsAOL3zmcQmrEmHwBpzUjh51Vy4" alt="avatar" />
                </div>
                <div className="flex flex-col gap-1 items-center w-full mt-3">
                    <h1 className="text-2xl font-semibold">OK Yarism</h1>
                    <p className="text-gray-300">Group • 3 Members</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-4">
                <h1 className="text-gray-300 mt-2">Created By</h1>
                <p>Rayyan on 16 July, 2024 at 5:50 PM</p>
                <h1 className="text-gray-300 mt-2">Description</h1>
                <p>OK Yarism the ultimate OK Yar Philosophy</p>
            </div>
            <div className="bg-white rounded-2xl">
                <h1 className="text-gray-300 p-4">Members</h1>
                {members.map((member) =>
                    <MembersListItems member={member} userItselfAdmin={userItselfAdmin} />
                )}
            </div>
        </div>
    )
}
