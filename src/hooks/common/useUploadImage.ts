import { ImageType } from '@/constants';
import { publicService } from '@/services';

export const useUploadImage = () => {
  const uploadImage = async (file: File, imageType: ImageType) =>
    await publicService.uploadImageFile(file, imageType);

  return { uploadImage };
};
