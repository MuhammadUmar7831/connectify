import { useSelector } from "react-redux";
import { GroupListItem } from "../../../types/groupListItem.type";
import { RootState } from "../../../redux/store";

export default function GroupInCommonListItems({ group }: { group: GroupListItem }) {
    const { user } = useSelector((state: RootState) => state.user);
    const memberNames = group.Members
        .map(member => member.UserId === user?.UserId ? 'You' : member.UserName)
        .join(', ');
    return (
        <div className="flex gap-2 mt-4">
            <div className="rounded-full w-12 h-12 overflow-hidden">
                <img src={group.Avatar} />
            </div>
            <div>
                <h1>{group.Name}</h1>
                <p className="text-gray-300 text-sm">{memberNames}</p>
            </div>
        </div>
    )
}
