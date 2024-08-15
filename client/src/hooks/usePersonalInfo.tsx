import friendType from '../types/friend.type';
import{useState,ChangeEvent} from 'react';
import { useDispatch } from 'react-redux';
import useCloudinary from './useCloudinary';
import { setSuccess } from '../redux/slices/success';
import { setError } from '../redux/slices/error';
import { updateUserApi } from '../api/user.api';

export default function usePersonalInfo() {
    const dispatch = useDispatch();
    const [userName, setUserName] = useState<string | null>(null);
    const [userDesc, setUserDesc] = useState<string | null>(null);
    const [userAvatarFile, setUserAvatarFile] = useState<null | File>(null);
    const [userInfo, setUserInfo] = useState<friendType | null>(null);
    const [updating, setUpdating] = useState<boolean>(false)
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const { uploadImage, deleteImage } = useCloudinary();

    const handleEditUserNameClick = () => {
        if (userInfo) {
            setUserName(userName === null ? userInfo?.Name : null);
        }
    };

    const handleEditUserDescClick = () => {
        if (userInfo) {
            setUserDesc(userDesc === null ? userInfo?.Bio : null);
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
        if (userInfo) {
            const newName = userName === null ? userInfo?.Name : userName;
            const newDesc = userDesc === null ? userInfo?.Bio : userDesc;
            let newAvatar = userAvatar === null ? userInfo?.Avatar : userAvatar;

            //not default avatar so delete it first from cloud
            if (newAvatar !== '/group.png') {
                const isDeleted = await deleteImage(userInfo?.Avatar);
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
                (newName !== userInfo?.Name && newName !== "") ||
                (newDesc !== userInfo?.Bio && newDesc !== "") ||
                (newAvatar !== userInfo?.Avatar && newAvatar !== "")
            ) {
                const body = {
                    UserId: userInfo?.UserId,
                    Name: newName,
                    Avatar: newAvatar,
                    Bio: newDesc
                };
                const res = await updateUserApi(body);
                if (res.success) {
                    setUserInfo((prevUserInfo) => {
                        if (prevUserInfo) {
                            return {
                                ...prevUserInfo,
                                Name: body.Name,
                                Avatar:newAvatar,
                                Bio: body.Bio
                            };
                        }
                        return prevUserInfo;
                    });
                    setUserName(null)
                    setUserDesc(null)
                    setUserAvatar(null)
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

    return {
        userInfo,
        setUserInfo,
        userName,
        setUserName,
        userDesc,
        setUserDesc,
        userAvatar,
        setUserAvatar,
        handleEditUserNameClick,
        handleEditUserDescClick,
        updateUser,
        handleImageChange,
        updating,
        setUpdating
    };
};
