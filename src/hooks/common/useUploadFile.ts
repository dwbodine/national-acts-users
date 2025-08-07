import { publicService } from '@/services';

export const useUploadFile = () => {
  const uploadTempFile = async (file: File) => await publicService.uploadTempFile(file);

  return { uploadTempFile };
};
