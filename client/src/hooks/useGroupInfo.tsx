import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import GroupInfoResponse from '../types/groupInfo.type';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { addMembersApi, deleteGroupApi, getGroupInfoApi, leaveGroupApi, updateGroupApi } from '../api/group.api';
import { setError } from '../redux/slices/error';
import { setSuccess } from '../redux/slices/success';
import { User } from '../types/user.type';
import useCloudinary from './useCloudinary';

export default function useGroupInfo() {
    const [groupInfo, setGroupInfo] = useState<GroupInfoResponse | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [addMemberSearch, setAddMemberSearch] = useState<boolean>(false);
    const [groupName, setGroupName] = useState<string | null>(null);
    const [groupDesc, setGroupDesc] = useState<string | null>(null);
    const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
    const [groupAvatarFile, setGroupAvatarFile] = useState<null | File>(null);
    const [updating, setUpdating] = useState<boolean>(false)
    const { uploadImage, deleteImage } = useCloudinary();
    const navigate = useNavigate();

    const getGroupInfo = async () => {
        const res = await getGroupInfoApi(27);
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
    
    const deleteGroup = async () => {
        if (groupInfo) {
            setLoading(true);
            const res = await deleteGroupApi({ groupId: groupInfo.GroupId });
            if (res.success) {
                dispatch(setSuccess(res.message));
                navigate("/");
            } else {
                dispatch(setError(res.message));
            }
            setLoading(false);
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setGroupAvatarFile(file)
            if (!file.type.startsWith('image/')) {
                dispatch(setError('The selected file is not an image'));
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setGroupAvatar(imageUrl);
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
                setAddMemberSearch(false);
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
        setUpdating(true);
        if (groupInfo) {
            const newName = groupName === null ? groupInfo?.GroupName : groupName;
            const newDesc = groupDesc === null ? groupInfo?.Description : groupDesc;
            let newAvatar = groupAvatar === null ? groupInfo?.Avatar : groupAvatar;

            //not default avatar so delete it first from cloud
            if (newAvatar !== '/group.png') {
                const isDeleted = await deleteImage(groupInfo?.Avatar);
                if (!isDeleted.success) {
                    setUpdating(false);
                    return;
                }
            }

            if (groupAvatarFile !== null) {
                const isUploaded = await uploadImage(groupAvatarFile);
                if (isUploaded.success) {
                    if (isUploaded.imageUrl) {
                        setGroupAvatar(isUploaded.imageUrl);
                        newAvatar = isUploaded.imageUrl;
                    }
                } else {
                    setUpdating(false);
                    return;
                }
            }

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
                                Avatar: newAvatar,
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
        setUpdating(false);
    };

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
        deleteGroup,
        addMembers,
        handleEditGroupNameClick,
        handleEditGroupDescClick,
        updateGroup,
        extractUserIds,
        handleImageChange,
        updating
    };
}
