import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setError } from '../redux/slices/error';

const useCloudinary = () => {
  const dispatch = useDispatch();

  const uploadImage = async (file: File, folder?: string): Promise<{ success: boolean, imageUrl?: string }> => {
    if (!folder) {
      folder = "/"
    }

    if (!file.type.startsWith('image/')) {
      dispatch(setError('The selected file is not an image'));
      return { success: false };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ttinigrd');
    formData.append('folder', folder);

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dj3vgnj0u/image/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: false
        }
      );
      return { success: true, imageUrl: response.data.secure_url };
    } catch (err: any) {
      console.log(err)
      dispatch(setError('Failed to upload image'))
      return { success: false };
    }
  };

  return { uploadImage };
};

export default useCloudinary;
