import { ImageType } from '@/constants';
import { publicService } from '@/services';

export const useUploadImage = () => {
  const uploadImage = async (file: File, imageType: ImageType, subfolder?: string) =>
    await publicService.uploadImageFile(file, imageType, subfolder);

  return { uploadImage };
};
