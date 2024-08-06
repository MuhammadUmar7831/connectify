import React, { useEffect, useMemo, useState } from 'react'
import GroupInfoResponse from '../types/groupInfo.type';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { addMembersApi, getGroupInfoApi, leaveGroupApi, updateGroupApi } from '../api/group.api';
import { setError } from '../redux/slices/error';
import { setSuccess } from '../redux/slices/success';
import { User } from '../types/user.type';

export default function useGroupInfo() {
    const [groupInfo, setGroupInfo] = useState<GroupInfoResponse | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [addMemberSearch, setAddMemberSearch] = useState<boolean>(false);
    const [groupName, setGroupName] = useState<string | null>(null);
    const [groupDesc, setGroupDesc] = useState<string | null>(null);
    const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
    const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);
    const navigate = useNavigate();

    const getGroupInfo = async () => {
        const res = await getGroupInfoApi(1);
        if (res.success) {
            setGroupInfo(res.data);
        } else {
            dispatch(setError(res.message));
        }
    };

    useEffect(() => {
        getGroupInfo();
    }, []);

    const userItselfAdmin = useMemo(() => {
        return groupInfo !== null ? groupInfo?.Members.some(
            (member) => member.UserId === user?.UserId && member.isAdmin
        ) : false;
    }, [groupInfo, user]);

    const leaveGroup = async () => {
        if (groupInfo) {
            setLoading(true);
            const res = await leaveGroupApi({ groupId: groupInfo.GroupId });
            if (res.success) {
                dispatch(setSuccess(res.message));
                navigate("/");
            } else {
                dispatch(setError(res.message));
            }
            setLoading(false);
        }
    };

    const extractUserIds = (): number[] => {
        return groupInfo !== null ? groupInfo?.Members.map(member => member.UserId) : [];
    };

    const addMembers = async (users: User[]) => {
        if (groupInfo) {
            const membersId = users.map(user => user.UserId);
            const body = { groupId: groupInfo.GroupId, membersId: membersId };
            const res = await addMembersApi(body);
            if (res.success) {
                dispatch(setSuccess(res.message));
                setGroupInfo((prevGroupInfo) => {
                    if (prevGroupInfo) {
                        return {
                            ...prevGroupInfo,
                            Members: [
                                ...prevGroupInfo.Members,
                                ...users.map(user => ({ ...user, isAdmin: 0 }))
                            ]
                        };
                    }
                    return prevGroupInfo;
                });
            } else {
                dispatch(setError(res.message));
            }
        }
    };

    const handleEditGroupNameClick = () => {
        if (groupInfo) {
            setGroupName(groupName === null ? groupInfo?.GroupName : null);
        }
    };

    const handleEditGroupDescClick = () => {
        if (groupInfo) {
            setGroupDesc(groupDesc === null ? groupInfo?.Description : null);
        }
    };

    const updateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (groupInfo) {
            const newName = groupName === null ? groupInfo?.GroupName : groupName;
            const newDesc = groupDesc === null ? groupInfo?.Description : groupDesc;
            const newAvatar = groupAvatar === null ? groupInfo?.Avatar : groupAvatar;

            if (
                (newName !== groupInfo?.GroupName && newName !== "") ||
                (newDesc !== groupInfo?.Description && newDesc !== "") ||
                (newAvatar !== groupInfo?.Avatar && newAvatar !== "")
            ) {
                const body = {
                    groupId: groupInfo?.GroupId,
                    name: newName,
                    avatar: newAvatar,
                    description: newDesc
                };
                const res = await updateGroupApi(body);
                if (res.success) {
                    setGroupInfo((prevGroupInfo) => {
                        if (prevGroupInfo) {
                            return {
                                ...prevGroupInfo,
                                GroupName: body.name,
                                Avatar: body.avatar,
                                Description: body.description
                            };
                        }
                        return prevGroupInfo;
                    });
                    dispatch(setSuccess(res.message));
                } else {
                    dispatch(setError(res.message));
                }
            }
            setGroupName(null);
            setGroupDesc(null);
            setGroupAvatar(null);
        }
    };

    const isPinned = useMemo(() => {
        return pinnedChats?.some((pinnedChat) => pinnedChat.ChatId === groupInfo?.ChatId);
    }, [pinnedChats, groupInfo]);

    return {
        groupInfo,
        setGroupInfo,
        userItselfAdmin,
        loading,
        setLoading,
        addMemberSearch,
        setAddMemberSearch,
        groupName,
        setGroupName,
        groupDesc,
        setGroupDesc,
        groupAvatar,
        setGroupAvatar,
        leaveGroup,
        addMembers,
        handleEditGroupNameClick,
        handleEditGroupDescClick,
        updateGroup,
        extractUserIds,
        isPinned,
    };
}
