import { publicService } from '../../services';
import { GetPageTypesResponse } from '@/types/event';

export const useGetPageTypes = () => {
  const getPageTypes = async (): Promise<GetPageTypesResponse> => {
    let response: GetPageTypesResponse = {
      pageTypes: undefined,
      pageTypeError: undefined,
    };
    response = await publicService.getPageTypes();
    return response;
  };

  return { getPageTypes };
};
