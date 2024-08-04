import AdminBadge from "../../../interface/AdminBadge";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserListItemMenu from "./UserListItemMenu";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { kickUserApi, makeAdminApi } from "../../../api/group.api";
import { setError } from "../../../redux/slices/error";
import GroupInfoResponse from "../../../types/groupInfo.type";
import { setSuccess } from "../../../redux/slices/success";
import { ClipLoader } from "react-spinners";

interface Props {
    member: {
        UserId: number;
        Name: string;
        Avatar: string;
        Bio: string;
        isAdmin: number // not bolean because MySql return False as O and True as 1
    },
    groupId: number,
    userItselfAdmin: Boolean,
    setGroupInfo: React.Dispatch<React.SetStateAction<GroupInfoResponse | null>>
}

export default function MembersListItems({ member, groupId, userItselfAdmin, setGroupInfo }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((state: RootState) => state.user)
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const closeMenu = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setMenuOpen(false);
        }
    }

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('click', closeMenu);
        } else {
            document.removeEventListener('click', closeMenu);
        }

        return () => {
            document.removeEventListener('click', closeMenu);
        };
    }, [menuOpen]);

    const kickUser = async () => {
        setMenuOpen(false)
        setLoading(true)
        const body = { toBeKickedId: member.UserId, groupId: groupId };
        const res = await kickUserApi(body);
        if (res.success) {
            setGroupInfo((prevGroupInfo) => {
                if (prevGroupInfo) {
                    return {
                        ...prevGroupInfo,
                        Members: prevGroupInfo.Members.filter((m) => m.UserId !== member.UserId),
                    };
                }
                return prevGroupInfo;
            });
            dispatch(setSuccess(res.message));
        } else {
            dispatch(setError(res.message));
        }
        setLoading(false)
    }

    const makeAdmin = async () => {
        setMenuOpen(false)
        setLoading(true)
        const body = { friendId: member.UserId, groupId: groupId };
        const res = await makeAdminApi(body);
        if (res.success) {
            setGroupInfo((prevGroupInfo) => {
                if (prevGroupInfo) {
                    return {
                        ...prevGroupInfo,
                        Members: prevGroupInfo.Members.map((m) =>
                            m.UserId === member.UserId ? { ...m, isAdmin: 1 } : m
                        ),
                    };
                }
                return prevGroupInfo;
            });
            dispatch(setSuccess(res.message));
        } else {
            dispatch(setError(res.message));
        }
        setLoading(false)
    }

    const removeAdmin = () => {
        setMenuOpen(false)
        console.log('Remove Admin');
    }

    const options = member.isAdmin ? ["Kick User", "Remove Admin"] : ["Kick User", "Make Admin"];
    const actions = member.isAdmin ? [kickUser, removeAdmin] : [kickUser, makeAdmin];

    return (
        <div className="flex justify-between p-4 hover:bg-gray-100">

            <div className="flex gap-2">
                <div className="rounded-full w-12 h-12 overflow-hidden">
                    <img src={member.Avatar} alt="Avatar" />
                </div>
                <div>
                    <h1>{member.UserId === user?.UserId ? 'You' : member.Name}</h1>
                    <p className="text-gray-300 text-sm">{member.Bio}</p>
                </div>
            </div>
            <div className="flex gap-2 justify-center items-center">
                {member.isAdmin === 1 && <AdminBadge />}
                {loading ? // show loader in case user is being made admin or being kicked
                    <ClipLoader size={20} color="#FF4D0C" /> :
                    <div className="relative" ref={menuRef}>
                        <UserListItemMenu isOpen={menuOpen} options={options} actions={actions} />
                        {
                            user?.UserId !== member.UserId && // this member is not user it self
                            userItselfAdmin && // user is admin of this group
                            <BsThreeDotsVertical onClick={toggleMenu} className="text-lg cursor-pointer" />
                        }
                    </div>
                }
            </div>
        </div>
    );
}
