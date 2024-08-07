import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setError } from '../redux/slices/error';
import CLOUD_NAME, { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../config/cloudinary.config';
import CryptoJS from "crypto-js";

const useCloudinary = () => {
  const dispatch = useDispatch();

  const uploadImage = async (file: File, folder?: string): Promise<{ success: boolean, imageUrl?: string }> => {

    if (!file.type.startsWith('image/')) {
      dispatch(setError('The selected file is not an image'));
      return { success: false };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ttinigrd');
    if (folder) {
      formData.append('folder', folder);
    }

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: false
        }
      );
      return { success: true, imageUrl: response.data.secure_url };
    } catch (err: any) {
      console.log(err);
      dispatch(setError('Failed to upload image'));
      return { success: false };
    }
  };

  const deleteImage = async (imageUrl: string): Promise<{ success: boolean }> => {
    const publicId = imageUrl.split('/').pop()?.split('.').shift();
    if (!publicId) {
      dispatch(setError('Invalid image URL'));
      return { success: false };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const apiSecret = CLOUDINARY_API_SECRET;

    // Generate the signature
    const signature = CryptoJS.SHA1(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`).toString(CryptoJS.enc.Hex);

    try {
      await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
        {
          public_id: publicId,
          signature,
          api_key: CLOUDINARY_API_KEY,
          timestamp
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false
        }
      );
      return { success: true };
    } catch (err: any) {
      console.log(err);
      dispatch(setError('Failed to delete image'));
      return { success: false };
    }
  };

  return { uploadImage, deleteImage };
};

export default useCloudinary;
