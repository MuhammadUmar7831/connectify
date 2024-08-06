import { useSelector } from "react-redux";
import { GroupListItem } from "../../../types/groupListItem.type";
import { RootState } from "../../../redux/store";
import { Link } from "react-router-dom";

export default function GroupInCommonListItems({ group }: { group: GroupListItem }) {
    const { user } = useSelector((state: RootState) => state.user);
    const memberNames = group.Members
        .map(member => member.UserId === user?.UserId ? 'You' : member.UserName)
        .join(', ');
    return (
        <Link to={`/info/group/${group.GroupId}`} className="flex gap-2 p-4 hover:bg-gray-100">
            <div className="rounded-full w-12 h-12 overflow-hidden">
                <img src={group.Avatar} />
            </div>
            <div>
                <h1>{group.Name}</h1>
                <p className="text-gray-300 text-sm">{memberNames}</p>
            </div>
        </Link>
    )
}
