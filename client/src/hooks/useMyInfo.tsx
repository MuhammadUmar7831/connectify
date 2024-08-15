import { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useCloudinary from './useCloudinary';
import { setSuccess } from '../redux/slices/success';
import { setError } from '../redux/slices/error';
import { updateUserApi } from '../api/user.api';
import { RootState } from '../redux/store';
import { setUser } from '../redux/slices/user';
import { User } from '../types/user.type';
import { signoutApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

export default function useMyInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userName, setUserName] = useState<string | null>(null);
    const [userDesc, setUserDesc] = useState<string | null>(null);
    const [userAvatarFile, setUserAvatarFile] = useState<null | File>(null);
    const [updating, setUpdating] = useState<boolean>(false)
    const [userAvatar, setUserAvatar] = useState<string | null>(null);

    const [isActiveChecked, setIsActiveChecked] = useState(false);
    const [isLastSeenChecked, setisLastSeenChecked] = useState(false);
    const { user } = useSelector((state: RootState) => state.user);

    const { uploadImage, deleteImage } = useCloudinary();

    const handleEditUserNameClick = () => {
        if (user) {
            setUserName(userName === null ? user?.Name : null);
        }
    };

    const handleEditUserDescClick = () => {
        if (user) {
            setUserDesc(userDesc === null ? user?.Bio : null);
        }
    };


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUserAvatarFile(file)
            if (!file.type.startsWith('image/')) {
                dispatch(setError('The selected file is not an image'));
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setUserAvatar(imageUrl);
        }
    };

    const updateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (updating) { return }
        setUpdating(true);
        if (user) {
            const newName = userName === null ? user?.Name : userName;
            const newDesc = userDesc === null ? user?.Bio : userDesc;
            let newAvatar = userAvatar === null ? user?.Avatar : userAvatar;

            //not default avatar so delete it first from cloud
            if (newAvatar !== '/group.png') {
                const isDeleted = await deleteImage(user?.Avatar);
                if (!isDeleted.success) {
                    setUpdating(false);
                    return;
                }
            }

            if (userAvatarFile !== null) {
                const isUploaded = await uploadImage(userAvatarFile);
                if (isUploaded.success) {
                    if (isUploaded.imageUrl) {
                        setUserAvatar(isUploaded.imageUrl);
                        newAvatar = isUploaded.imageUrl;
                    }
                } else {
                    setUpdating(false);
                    return;
                }
            }

            if (
                (newName !== user?.Name && newName !== "") ||
                (newDesc !== user?.Bio && newDesc !== "") ||
                (newAvatar !== user?.Avatar && newAvatar !== "")
            ) {
                const body = {
                    UserId: user?.UserId,
                    Name: newName,
                    Avatar: newAvatar,
                    Bio: newDesc
                };

                const res = await updateUserApi(body);
                if (res.success) {
                    const updatedUser: User = {
                        ...user,
                        Name: body.Name,
                        Avatar: body.Avatar,
                        Bio: body.Bio
                    };

                    dispatch(setUser(updatedUser));
                    dispatch(setSuccess(res.message));
                } else {
                    dispatch(setError(res.message));
                }
            }
            setUserName(null);
            setUserDesc(null);
            setUserAvatar(null);
        }
        setUpdating(false);
    };

    const signout = async () => {
        const res = await signoutApi();
        if (res.success) {
            navigate("/signin")
            dispatch(setSuccess(res.message))
        } else {
            dispatch(setError(res.message))
        }
    }

    return {
        user,
        userName,
        setUserName,
        userDesc,
        setUserDesc,
        userAvatar,
        setUserAvatar,
        setUserAvatarFile,
        isActiveChecked,
        setIsActiveChecked,
        isLastSeenChecked,
        setisLastSeenChecked,
        handleEditUserNameClick,
        handleEditUserDescClick,
        updateUser,
        handleImageChange,
        updating,
        setUpdating,
        signout,
    };
};
