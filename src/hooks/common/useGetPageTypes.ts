import { publicService } from '../../services';
import { GetPageTypesResponse } from '@/types/event';

export const useGetPageTypes = () => {
  const getPageTypes = async (sellerTypesOnly: boolean = false): Promise<GetPageTypesResponse> => {
    let response: GetPageTypesResponse = {
      pageTypes: undefined,
      pageTypeError: undefined,
    };
    response = await publicService.getPageTypes(sellerTypesOnly);
    return response;
  };

  return { getPageTypes };
};
