import AdminBadge from "../../../interface/AdminBadge";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserListItemMenu from "./UserListItemMenu";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface Props {
    member: {
        UserId: number;
        Name: string;
        Avatar: string;
        Bio: string;
        isAdmin: Boolean
    },
    userItselfAdmin: Boolean
}

export default function MembersListItems({ member, userItselfAdmin }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((state: RootState) => state.user)

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

    const kickUser = () => {
        setMenuOpen(false)
        console.log('User Kicked');
    }

    const makeAdmin = () => {
        setMenuOpen(false)
        console.log('Made Admin');
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
                {member.isAdmin && <AdminBadge />}
                <div className="relative" ref={menuRef}>
                    <UserListItemMenu isOpen={menuOpen} options={options} actions={actions} />
                    {
                        user?.UserId !== member.UserId && // this member is not user it self
                        userItselfAdmin && // user is admin of this group
                        <BsThreeDotsVertical onClick={toggleMenu} className="text-lg cursor-pointer" />
                    }
                </div>
            </div>
        </div>
    );
}
